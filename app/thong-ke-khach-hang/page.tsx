"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TKKhachHang } from "@/lib/types"
import { fetchThongKeKhachHang } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function ThongKeKhachHangPage() {
  const [thongKeData, setThongKeData] = useState<TKKhachHang[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadThongKeData()
  }, [])

  const loadThongKeData = async () => {
    try {
      setLoading(true)
      const data = await fetchThongKeKhachHang()
      setThongKeData(data)
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = thongKeData.map((item) => ({
    name: `${item.khachHang.ho} ${item.khachHang.ten}`,
    doanhThu: item.doanhThu,
  }))

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê khách hàng theo doanh thu</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h2>
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
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="doanhThu" fill="#3b82f6" name="Doanh thu (VNĐ)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bảng thống kê doanh thu</h2>
        <Button onClick={loadThongKeData} className="mb-4">
          Làm mới dữ liệu
        </Button>

        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ tên khách hàng</TableHead>
                  <TableHead>Số điện thoại</TableHead>
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
                    <TableRow key={item.khachHang.id}>
                      <TableCell>{item.khachHang.id}</TableCell>
                      <TableCell>{`${item.khachHang.ho} ${item.khachHang.ten}`}</TableCell>
                      <TableCell>{item.khachHang.sdt}</TableCell>
                      <TableCell>{item.khachHang.email}</TableCell>
                      <TableCell className="text-right font-medium">{item.doanhThu.toLocaleString("vi-VN")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

