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
  const [loading, setLoading] = useState(true)

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10) // Số bản ghi mỗi trang
  const pageSizeOptions = [5, 10, 20, 50, 100]
  const totalPages = Math.ceil(allThongKeData.length / pageSize)

  useEffect(() => {
    loadThongKeData()
  }, [])

  const loadThongKeData = async () => {
    try {
      setLoading(true)
      const data = await fetchThongKeKhachHang()
      console.log('Received statistics data:', data);
      if (Array.isArray(data)) {
        setAllThongKeData(data)
        setCurrentPage(1) // Reset về trang đầu tiên khi load dữ liệu mới
      } else {
        console.error('Received non-array data:', data);
        setAllThongKeData([])
      }
    } catch (error) {
      console.error("Error loading statistics:", error)
      setAllThongKeData([])
    } finally {
      setLoading(false)
    }
  }

  // Lấy dữ liệu cho trang hiện tại
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    setThongKeData(allThongKeData.slice(startIndex, endIndex))
  }, [allThongKeData, currentPage, pageSize])

  // Dữ liệu cho biểu đồ - chỉ sử dụng dữ liệu của trang hiện tại
  const chartData = thongKeData && thongKeData.length > 0
    ? thongKeData.map((item) => ({
        name: item.customerName || 'Khách hàng không tên',
        doanhThu: item.totalRevenue || 0,
      }))
    : [{ name: 'Không có dữ liệu', doanhThu: 0 }]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê khách hàng theo doanh thu</h1>

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
              <Tooltip formatter={(value) => value.toLocaleString("vi-VN")} />
              <Legend />
              <Bar dataKey="doanhThu" fill="#3b82f6" name="Doanh thu (VNĐ)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bảng thống kê doanh thu</h2>
        <div className="flex gap-4 mb-4">
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
        </div>

        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ tên khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Doanh thu (VNĐ)</TableHead>
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
                    <TableRow key={item.customerId}>
                      <TableCell>{item.customerId}</TableCell>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell>{item.customerEmail}</TableCell>
                      <TableCell className="text-right font-medium">{item.totalRevenue.toLocaleString("vi-VN")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Phân trang */}
        {allThongKeData.length > 0 && (
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
                Hiển thị {allThongKeData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} đến {Math.min(currentPage * pageSize, allThongKeData.length)} trong tổng số {allThongKeData.length} bản ghi
              </div>
            </div>

            {allThongKeData.length > pageSize && (
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

