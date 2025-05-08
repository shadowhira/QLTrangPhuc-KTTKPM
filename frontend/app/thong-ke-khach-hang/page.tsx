"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TKKhachHang } from "@/lib/types"
import { fetchThongKeKhachHang, generateThongKeKhachHang } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function ThongKeKhachHangPage() {
  const [thongKeData, setThongKeData] = useState<TKKhachHang[]>([])
  const [allThongKeData, setAllThongKeData] = useState<TKKhachHang[]>([])
  const [filteredData, setFilteredData] = useState<TKKhachHang[]>([])
  const [loading, setLoading] = useState(true)

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10) // Số bản ghi mỗi trang
  const pageSizeOptions = [5, 10, 20, 50, 100]
  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Bộ lọc
  const [filters, setFilters] = useState({
    customerName: "",
    email: "",
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
    key: 'tongDoanhThu',
    direction: 'descending'
  })

  useEffect(() => {
    loadThongKeData()
  }, [])

  // Hàm xử lý lọc dữ liệu
  const applyFilters = () => {
    let result = [...allThongKeData];

    // Lọc theo tên khách hàng
    if (filters.customerName) {
      const searchTerm = filters.customerName.toLowerCase();
      result = result.filter(item =>
        item.tenKhachHang && item.tenKhachHang.toLowerCase().includes(searchTerm)
      );
    }

    // Lọc theo email
    if (filters.email) {
      const searchTerm = filters.email.toLowerCase();
      result = result.filter(item =>
        item.emailKhachHang && item.emailKhachHang.toLowerCase().includes(searchTerm)
      );
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
      customerName: "",
      email: "",
      minRevenue: "",
      maxRevenue: "",
      minOrders: "",
      maxOrders: "",
      showFilters: false
    });
    setFilteredData(allThongKeData);
    setCurrentPage(1);
  };

  const loadThongKeData = async () => {
    try {
      setLoading(true)
      const data = await fetchThongKeKhachHang()
      console.log('Received statistics data:', data);
      if (Array.isArray(data)) {
        setAllThongKeData(data)
        setFilteredData(data) // Cập nhật filteredData với dữ liệu mới
        setCurrentPage(1) // Reset về trang đầu tiên khi load dữ liệu mới
      } else {
        console.error('Received non-array data:', data);
        setAllThongKeData([])
        setFilteredData([])
      }
    } catch (error) {
      console.error("Error loading statistics:", error)
      setAllThongKeData([])
      setFilteredData([])
    } finally {
      setLoading(false)
    }
  }

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
  const sortData = (data: TKKhachHang[]) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof TKKhachHang];
      const bValue = b[sortConfig.key as keyof TKKhachHang];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

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

    // Ở đây filteredData đã được cập nhật với giá trị mới
    console.log('FilteredData (đã cập nhật): ', filteredData);
  }, [filteredData, currentPage, pageSize, sortConfig])

  // Dữ liệu cho biểu đồ - chỉ sử dụng dữ liệu của trang hiện tại
  const chartData = thongKeData && thongKeData.length > 0
    ? thongKeData.map((item) => ({
        name: item.tenKhachHang || 'Khách hàng không tên',
        doanhThu: item.tongDoanhThu || 0, // Đảm bảo có giá trị mặc định là 0 nếu tongDoanhThu là null hoặc undefined
        donHang: item.tongDonHang || 0, // Thêm số đơn hàng vào biểu đồ
      }))
    : [{ name: 'Không có dữ liệu', doanhThu: 0, donHang: 0 }]



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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                <input
                  type="text"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleFilterChange}
                  className="border rounded p-2 w-full"
                  placeholder="Nhập tên khách hàng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                  className="border rounded p-2 w-full"
                  placeholder="Nhập email khách hàng"
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
      <h1 className="text-2xl font-bold mb-6">Thống kê khách hàng theo doanh thu</h1>

      <FilterComponent />

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h2>
        <div className="mb-2 text-sm text-gray-500 italic">
          Biểu đồ hiển thị dữ liệu của trang hiện tại ({thongKeData.length} bản ghi)
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              className="p-[20px]"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value ? value.toLocaleString("vi-VN") : '0'} />
              <Legend />
              <Bar dataKey="doanhThu" fill="#3b82f6" name="Doanh thu (VNĐ)" />
              <Bar dataKey="donHang" fill="#10b981" name="Số đơn hàng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bảng thống kê doanh thu</h2>
        {/* <div className="flex gap-4 mb-4">
          <Button onClick={loadThongKeData}>
            Làm mới dữ liệu
          </Button>
          <Button onClick={async () => {
            setLoading(true);
            try {
              await generateThongKeKhachHang();
              await loadThongKeData();
            } catch (error) {
              console.error("Error generating statistics:", error);
            } finally {
              setLoading(false);
            }
          }} variant="outline">
            Tạo thống kê mới
          </Button>
        </div> */}

        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('khachHangId')}
                  >
                    ID
                    {sortConfig.key === 'khachHangId' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('tenKhachHang')}
                  >
                    Họ tên khách hàng
                    {sortConfig.key === 'tenKhachHang' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('emailKhachHang')}
                  >
                    Email
                    {sortConfig.key === 'emailKhachHang' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-gray-100"
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
                    Doanh thu (VNĐ)
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
                    <TableCell colSpan={5} className="text-center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  thongKeData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.khachHangId}</TableCell>
                      <TableCell>{item.tenKhachHang}</TableCell>
                      <TableCell>{item.emailKhachHang}</TableCell>
                      <TableCell className="text-center">{item.tongDonHang}</TableCell>
                      <TableCell className="text-right font-medium">{item.tongDoanhThu ? item.tongDoanhThu.toLocaleString("vi-VN") : '0'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Phân trang */}
        {filteredData.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border rounded p-1 text-sm"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">bản ghi mỗi trang</span>
              </div>

              <div className="text-sm text-gray-700">
                Hiển thị {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} đến {Math.min(currentPage * pageSize, filteredData.length)} trong tổng số {filteredData.length} bản ghi
              </div>
            </div>

            {filteredData.length > pageSize && (
              <div className="mt-2 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

