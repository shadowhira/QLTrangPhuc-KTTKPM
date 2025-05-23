'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  fetchThongKeDoanhThu,
  fetchThongKeDoanhThuByPeriod,
  generateThongKeDoanhThuThang,
  generateThongKeDoanhThuQuy,
  generateThongKeDoanhThuNam
} from "@/lib/api"
import type { TKDoanhThu } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PaginationControls from "@/components/pagination-controls";

export default function ThongKeDoanhThuPage() {
  const [thongKeData, setThongKeData] = useState<TKDoanhThu[]>([])
  const [allThongKeData, setAllThongKeData] = useState<TKDoanhThu[]>([])
  const [filteredData, setFilteredData] = useState<TKDoanhThu[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [quarter, setQuarter] = useState(Math.floor((new Date().getMonth() + 3) / 3))

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10) // Số bản ghi mỗi trang
  const pageSizeOptions = [5, 10, 20, 50, 100]

  // Bộ lọc
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minRevenue: "",
    maxRevenue: "",
    minOrders: "",
    maxOrders: "",
    showFilters: false
  })

  // Sắp xếp
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: 'ngayBatDau',
    direction: 'descending'
  })

  useEffect(() => {
    loadThongKeData()
  }, [activeTab])

  const loadThongKeData = async () => {
    try {
      setLoading(true)
      let data

      switch (activeTab) {
        case "month":
          data = await fetchThongKeDoanhThuByPeriod("THANG")
          break
        case "quarter":
          data = await fetchThongKeDoanhThuByPeriod("QUY")
          break
        case "year":
          data = await fetchThongKeDoanhThuByPeriod("NAM")
          break
        default:
          data = await fetchThongKeDoanhThu()
      }

      setAllThongKeData(data)
      setFilteredData(data) // Cập nhật filteredData với dữ liệu mới
      setCurrentPage(1) // Reset về trang đầu tiên khi load dữ liệu mới
    } catch (error) {
      console.error("Error loading statistics:", error)
      setAllThongKeData([])
      setFilteredData([])
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMonthly = async () => {
    try {
      setLoading(true)
      const result = await generateThongKeDoanhThuThang(year, month)
      if (result) {
        // Chuyển tab sang "month" nếu đang ở tab khác
        setActiveTab("month")
        // Lấy dữ liệu thống kê theo tháng
        const data = await fetchThongKeDoanhThuByPeriod("THANG")
        // Lọc dữ liệu để chỉ hiển thị kỳ vừa tạo
        const giaTriKy = `${year}-${month.toString().padStart(2, '0')}`
        const filteredResult = data.filter(item => item.giaTriKy === giaTriKy)
        setAllThongKeData(filteredResult)
        setFilteredData(filteredResult)
        setCurrentPage(1)
      } else {
        // Nếu không tạo được thống kê, vẫn load lại dữ liệu
        loadThongKeData()
      }
    } catch (error) {
      console.error("Error generating monthly statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQuarterly = async () => {
    try {
      setLoading(true)
      const result = await generateThongKeDoanhThuQuy(year, quarter)
      if (result) {
        // Chuyển tab sang "quarter" nếu đang ở tab khác
        setActiveTab("quarter")
        // Lấy dữ liệu thống kê theo quý
        const data = await fetchThongKeDoanhThuByPeriod("QUY")
        // Lọc dữ liệu để chỉ hiển thị kỳ vừa tạo
        const giaTriKy = `${year}-Q${quarter}`
        const filteredResult = data.filter(item => item.giaTriKy === giaTriKy)
        setAllThongKeData(filteredResult)
        setFilteredData(filteredResult)
        setCurrentPage(1)
      } else {
        // Nếu không tạo được thống kê, vẫn load lại dữ liệu
        loadThongKeData()
      }
    } catch (error) {
      console.error("Error generating quarterly statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateYearly = async () => {
    try {
      setLoading(true)
      const result = await generateThongKeDoanhThuNam(year)
      if (result) {
        // Chuyển tab sang "year" nếu đang ở tab khác
        setActiveTab("year")
        // Lấy dữ liệu thống kê theo năm
        const data = await fetchThongKeDoanhThuByPeriod("NAM")
        // Lọc dữ liệu để chỉ hiển thị kỳ vừa tạo
        const giaTriKy = `${year}`
        const filteredResult = data.filter(item => item.giaTriKy === giaTriKy)
        setAllThongKeData(filteredResult)
        setFilteredData(filteredResult)
        setCurrentPage(1)
      } else {
        // Nếu không tạo được thống kê, vẫn load lại dữ liệu
        loadThongKeData()
      }
    } catch (error) {
      console.error("Error generating yearly statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Hàm xử lý sắp xếp
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'ascending';
      }
    }

    setSortConfig({ key, direction });
  };

  // Hàm sắp xếp dữ liệu
  const sortData = (data: TKDoanhThu[]) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof TKDoanhThu];
      const bValue = b[sortConfig.key as keyof TKDoanhThu];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Xử lý đặc biệt cho ngày
      if (sortConfig.key === 'ngayBatDau' || sortConfig.key === 'ngayKetThuc' || sortConfig.key === 'ngayTao') {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return sortConfig.direction === 'ascending'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'ascending'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  // Hàm xử lý lọc dữ liệu
  const applyFilters = () => {
    let result = [...allThongKeData];

    // Lọc theo ngày bắt đầu
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(item => new Date(item.ngayBatDau) >= startDate);
    }

    // Lọc theo ngày kết thúc
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter(item => new Date(item.ngayKetThuc) <= endDate);
    }

    // Lọc theo doanh thu tối thiểu
    if (filters.minRevenue) {
      const minRevenue = parseFloat(filters.minRevenue);
      result = result.filter(item => item.tongDoanhThu >= minRevenue);
    }

    // Lọc theo doanh thu tối đa
    if (filters.maxRevenue) {
      const maxRevenue = parseFloat(filters.maxRevenue);
      result = result.filter(item => item.tongDoanhThu <= maxRevenue);
    }

    // Lọc theo số đơn hàng tối thiểu
    if (filters.minOrders) {
      const minOrders = parseInt(filters.minOrders);
      result = result.filter(item => item.tongDonHang >= minOrders);
    }

    // Lọc theo số đơn hàng tối đa
    if (filters.maxOrders) {
      const maxOrders = parseInt(filters.maxOrders);
      result = result.filter(item => item.tongDonHang <= maxOrders);
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset về trang đầu tiên khi áp dụng bộ lọc
  };

  // Hàm reset bộ lọc
  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      minRevenue: "",
      maxRevenue: "",
      minOrders: "",
      maxOrders: "",
      showFilters: false
    });
    setFilteredData(allThongKeData);
    setCurrentPage(1);
  };

  // Áp dụng bộ lọc khi filters thay đổi
  useEffect(() => {
    if (allThongKeData.length > 0) {
      applyFilters();
    }
  }, [allThongKeData, sortConfig]);

  // Lấy dữ liệu cho trang hiện tại
  useEffect(() => {
    const sortedData = sortData(filteredData);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setThongKeData(sortedData.slice(startIndex, endIndex));
  }, [filteredData, currentPage, pageSize, sortConfig]);

  // Dữ liệu cho biểu đồ - chỉ sử dụng dữ liệu của trang hiện tại
  const chartData = thongKeData.map((item) => ({
    name: item.giaTriKy,
    doanhThu: item.tongDoanhThu,
  }));

  // Component bộ lọc
  const FilterComponent = () => {
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      applyFilters();
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bộ lọc thống kê</h3>
          <Button
            variant="ghost"
            onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
          >
            {filters.showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </Button>
        </div>

        {filters.showFilters && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doanh thu từ</label>
                <input
                  type="number"
                  name="minRevenue"
                  value={filters.minRevenue}
                  onChange={handleFilterChange}
                  placeholder="VNĐ"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Doanh thu đến</label>
                <input
                  type="number"
                  name="maxRevenue"
                  value={filters.maxRevenue}
                  onChange={handleFilterChange}
                  placeholder="VNĐ"
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Số đơn hàng từ</label>
                <input
                  type="number"
                  name="minOrders"
                  value={filters.minOrders}
                  onChange={handleFilterChange}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số đơn hàng đến</label>
                <input
                  type="number"
                  name="maxOrders"
                  value={filters.maxOrders}
                  onChange={handleFilterChange}
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetFilters}>
                Đặt lại
              </Button>
              <Button type="submit">
                Áp dụng
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thống kê doanh thu trang phục</h1>

      <FilterComponent />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="month">Theo tháng</TabsTrigger>
          <TabsTrigger value="quarter">Theo quý</TabsTrigger>
          <TabsTrigger value="year">Theo năm</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan doanh thu trang phục</CardTitle>
              <CardDescription>Thống kê doanh thu trang phục theo tất cả các kỳ</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <>
                  <div className="h-80 mb-6">
                    <div className="mb-2 text-sm text-gray-500 italic">
                      Biểu đồ hiển thị dữ liệu của trang hiện tại ({thongKeData.length} bản ghi)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} className="p-[20px]">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? value.toLocaleString("vi-VN") : '0'} />
                        <Legend />
                        <Bar dataKey="doanhThu" name="Doanh thu" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('giaTriKy')}
                          >
                            Kỳ
                            {sortConfig.key === 'giaTriKy' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('kyThongKe')}
                          >
                            Loại kỳ
                            {sortConfig.key === 'kyThongKe' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayBatDau')}
                          >
                            Ngày bắt đầu
                            {sortConfig.key === 'ngayBatDau' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayKetThuc')}
                          >
                            Ngày kết thúc
                            {sortConfig.key === 'ngayKetThuc' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDonHang')}
                          >
                            Số đơn hàng
                            {sortConfig.key === 'tongDonHang' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="text-right cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDoanhThu')}
                          >
                            Doanh thu
                            {sortConfig.key === 'tongDoanhThu' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {thongKeData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">Không có dữ liệu</TableCell>
                          </TableRow>
                        ) : (
                          thongKeData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.giaTriKy}</TableCell>
                              <TableCell>{item.kyThongKe}</TableCell>
                              <TableCell>{new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{new Date(item.ngayKetThuc).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{item.tongDonHang}</TableCell>
                              <TableCell className="text-right font-medium">{item.tongDoanhThu ? item.tongDoanhThu.toLocaleString("vi-VN") : '0'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Phân trang */}
                  {filteredData.length > 0 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      totalItems={filteredData.length}
                      setCurrentPage={setCurrentPage}
                      setPageSize={setPageSize}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh thu trang phục theo tháng</CardTitle>
              <CardDescription>Tạo thống kê doanh thu trang phục cho một tháng cụ thể</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Năm</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="border rounded p-2 w-24"
                    min="2000"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tháng</label>
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="border rounded p-2 w-24"
                    min="1"
                    max="12"
                  />
                </div>
                <div className="self-end">
                  <Button onClick={handleGenerateMonthly} disabled={loading}>
                    Tạo thống kê
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <>
                  {/* Biểu đồ cho tab tháng */}
                  <div className="h-80 mb-6">
                    <div className="mb-2 text-sm text-gray-500 italic">
                      Biểu đồ hiển thị dữ liệu của trang hiện tại ({thongKeData.length} bản ghi)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} className="p-[20px]">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? value.toLocaleString("vi-VN") : '0'} />
                        <Legend />
                        <Bar dataKey="doanhThu" name="Doanh thu" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('giaTriKy')}
                          >
                            Kỳ
                            {sortConfig.key === 'giaTriKy' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayBatDau')}
                          >
                            Ngày bắt đầu
                            {sortConfig.key === 'ngayBatDau' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayKetThuc')}
                          >
                            Ngày kết thúc
                            {sortConfig.key === 'ngayKetThuc' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDonHang')}
                          >
                            Số đơn hàng
                            {sortConfig.key === 'tongDonHang' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="text-right cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDoanhThu')}
                          >
                            Doanh thu
                            {sortConfig.key === 'tongDoanhThu' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {thongKeData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">Không có dữ liệu</TableCell>
                          </TableRow>
                        ) : (
                          thongKeData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.giaTriKy}</TableCell>
                              <TableCell>{new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{new Date(item.ngayKetThuc).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{item.tongDonHang}</TableCell>
                              <TableCell className="text-right font-medium">{item.tongDoanhThu ? item.tongDoanhThu.toLocaleString("vi-VN") : '0'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Phân trang cho tab tháng */}
                  {filteredData.length > 0 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      totalItems={filteredData.length}
                      setCurrentPage={setCurrentPage}
                      setPageSize={setPageSize}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarter">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh thu trang phục theo quý</CardTitle>
              <CardDescription>Tạo thống kê doanh thu trang phục cho một quý cụ thể</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Năm</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="border rounded p-2 w-24"
                    min="2000"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quý</label>
                  <input
                    type="number"
                    value={quarter}
                    onChange={(e) => setQuarter(parseInt(e.target.value))}
                    className="border rounded p-2 w-24"
                    min="1"
                    max="4"
                  />
                </div>
                <div className="self-end">
                  <Button onClick={handleGenerateQuarterly} disabled={loading}>
                    Tạo thống kê
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <>
                  {/* Biểu đồ cho tab quý */}
                  <div className="h-80 mb-6">
                    <div className="mb-2 text-sm text-gray-500 italic">
                      Biểu đồ hiển thị dữ liệu của trang hiện tại ({thongKeData.length} bản ghi)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} className="p-[20px]">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? value.toLocaleString("vi-VN") : '0'} />
                        <Legend />
                        <Bar dataKey="doanhThu" name="Doanh thu" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('giaTriKy')}
                          >
                            Kỳ
                            {sortConfig.key === 'giaTriKy' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayBatDau')}
                          >
                            Ngày bắt đầu
                            {sortConfig.key === 'ngayBatDau' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayKetThuc')}
                          >
                            Ngày kết thúc
                            {sortConfig.key === 'ngayKetThuc' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDonHang')}
                          >
                            Số đơn hàng
                            {sortConfig.key === 'tongDonHang' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="text-right cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDoanhThu')}
                          >
                            Doanh thu
                            {sortConfig.key === 'tongDoanhThu' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {thongKeData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">Không có dữ liệu</TableCell>
                          </TableRow>
                        ) : (
                          thongKeData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.giaTriKy}</TableCell>
                              <TableCell>{new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{new Date(item.ngayKetThuc).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{item.tongDonHang}</TableCell>
                              <TableCell className="text-right font-medium">{item.tongDoanhThu ? item.tongDoanhThu.toLocaleString("vi-VN") : '0'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Phân trang cho tab quý */}
                  {filteredData.length > 0 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      totalItems={filteredData.length}
                      setCurrentPage={setCurrentPage}
                      setPageSize={setPageSize}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh thu trang phục theo năm</CardTitle>
              <CardDescription>Tạo thống kê doanh thu trang phục cho một năm cụ thể</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Năm</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="border rounded p-2 w-24"
                    min="2000"
                    max="2100"
                  />
                </div>
                <div className="self-end">
                  <Button onClick={handleGenerateYearly} disabled={loading}>
                    Tạo thống kê
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <>
                  {/* Biểu đồ cho tab năm */}
                  <div className="h-80 mb-6">
                    <div className="mb-2 text-sm text-gray-500 italic">
                      Biểu đồ hiển thị dữ liệu của trang hiện tại ({thongKeData.length} bản ghi)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} className="p-[20px]">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? value.toLocaleString("vi-VN") : '0'} />
                        <Legend />
                        <Bar dataKey="doanhThu" name="Doanh thu" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('giaTriKy')}
                          >
                            Kỳ
                            {sortConfig.key === 'giaTriKy' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayBatDau')}
                          >
                            Ngày bắt đầu
                            {sortConfig.key === 'ngayBatDau' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('ngayKetThuc')}
                          >
                            Ngày kết thúc
                            {sortConfig.key === 'ngayKetThuc' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDonHang')}
                          >
                            Số đơn hàng
                            {sortConfig.key === 'tongDonHang' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead
                            className="text-right cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tongDoanhThu')}
                          >
                            Doanh thu
                            {sortConfig.key === 'tongDoanhThu' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {thongKeData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">Không có dữ liệu</TableCell>
                          </TableRow>
                        ) : (
                          thongKeData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.giaTriKy}</TableCell>
                              <TableCell>{new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{new Date(item.ngayKetThuc).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{item.tongDonHang}</TableCell>
                              <TableCell className="text-right font-medium">{item.tongDoanhThu ? item.tongDoanhThu.toLocaleString("vi-VN") : '0'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Phân trang cho tab năm */}
                  {filteredData.length > 0 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      totalItems={filteredData.length}
                      setCurrentPage={setCurrentPage}
                      setPageSize={setPageSize}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
