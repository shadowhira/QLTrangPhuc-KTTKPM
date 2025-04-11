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

export default function ThongKeDoanhThuPage() {
  const [thongKeData, setThongKeData] = useState<TKDoanhThu[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [quarter, setQuarter] = useState(Math.floor((new Date().getMonth() + 3) / 3))

  useEffect(() => {
    loadThongKeData()
  }, [activeTab])

  const loadThongKeData = async () => {
    try {
      setLoading(true)
      let data

      switch (activeTab) {
        case "month":
          data = await fetchThongKeDoanhThuByPeriod("MONTH")
          break
        case "quarter":
          data = await fetchThongKeDoanhThuByPeriod("QUARTER")
          break
        case "year":
          data = await fetchThongKeDoanhThuByPeriod("YEAR")
          break
        default:
          data = await fetchThongKeDoanhThu()
      }

      setThongKeData(data)
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMonthly = async () => {
    try {
      setLoading(true)
      await generateThongKeDoanhThuThang(year, month)
      loadThongKeData()
    } catch (error) {
      console.error("Error generating monthly statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQuarterly = async () => {
    try {
      setLoading(true)
      await generateThongKeDoanhThuQuy(year, quarter)
      loadThongKeData()
    } catch (error) {
      console.error("Error generating quarterly statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateYearly = async () => {
    try {
      setLoading(true)
      await generateThongKeDoanhThuNam(year)
      loadThongKeData()
    } catch (error) {
      console.error("Error generating yearly statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = thongKeData.map((item) => ({
    name: item.periodValue,
    doanhThu: item.totalRevenue,
  }))

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê doanh thu</h1>

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
              <CardTitle>Tổng quan doanh thu</CardTitle>
              <CardDescription>Thống kê doanh thu theo tất cả các kỳ</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} className="p-[20px]">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => value.toLocaleString("vi-VN")} />
                        <Legend />
                        <Bar dataKey="doanhThu" name="Doanh thu" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kỳ</TableHead>
                          <TableHead>Loại kỳ</TableHead>
                          <TableHead>Ngày bắt đầu</TableHead>
                          <TableHead>Ngày kết thúc</TableHead>
                          <TableHead>Số đơn hàng</TableHead>
                          <TableHead className="text-right">Doanh thu</TableHead>
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
                              <TableCell>{item.periodValue}</TableCell>
                              <TableCell>{item.period}</TableCell>
                              <TableCell>{new Date(item.startDate).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{new Date(item.endDate).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>{item.totalOrders}</TableCell>
                              <TableCell className="text-right font-medium">{item.totalRevenue.toLocaleString("vi-VN")}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh thu theo tháng</CardTitle>
              <CardDescription>Tạo thống kê doanh thu cho một tháng cụ thể</CardDescription>
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kỳ</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Số đơn hàng</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
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
                            <TableCell>{item.periodValue}</TableCell>
                            <TableCell>{new Date(item.startDate).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{new Date(item.endDate).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{item.totalOrders}</TableCell>
                            <TableCell className="text-right font-medium">{item.totalRevenue.toLocaleString("vi-VN")}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarter">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh thu theo quý</CardTitle>
              <CardDescription>Tạo thống kê doanh thu cho một quý cụ thể</CardDescription>
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kỳ</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Số đơn hàng</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
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
                            <TableCell>{item.periodValue}</TableCell>
                            <TableCell>{new Date(item.startDate).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{new Date(item.endDate).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{item.totalOrders}</TableCell>
                            <TableCell className="text-right font-medium">{item.totalRevenue.toLocaleString("vi-VN")}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh thu theo năm</CardTitle>
              <CardDescription>Tạo thống kê doanh thu cho một năm cụ thể</CardDescription>
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kỳ</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Số đơn hàng</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
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
                            <TableCell>{item.periodValue}</TableCell>
                            <TableCell>{new Date(item.startDate).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{new Date(item.endDate).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{item.totalOrders}</TableCell>
                            <TableCell className="text-right font-medium">{item.totalRevenue.toLocaleString("vi-VN")}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
