"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { KhachHang } from "@/lib/types"
import { fetchKhachHang, createKhachHang, updateKhachHang, deleteKhachHang } from "@/lib/api"

export default function QuanLyKhachHangPage() {
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<KhachHang>>({
    ho: "",
    ten: "",
    sdt: "",
    email: "",
    diaChi: {
      thonXom: "",
      quanHuyen: "",
      tinhThanhPho: "",
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)

  useEffect(() => {
    loadKhachHang()
  }, [])

  const loadKhachHang = async () => {
    try {
      setLoading(true)
      const data = await fetchKhachHang()
      setKhachHangs(data)
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as any),
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Tạo object mới để tránh vấn đề với kiểu dữ liệu
      // Tạo object mới với cấu trúc đúng
      const customerData: any = {
        ho: formData.ho || '',
        ten: formData.ten || '',
        sdt: formData.sdt || '',
        email: formData.email || '',
        diaChi: {
          thonXom: formData.diaChi?.thonXom || '',
          quanHuyen: formData.diaChi?.quanHuyen || '',
          tinhThanhPho: formData.diaChi?.tinhThanhPho || ''
        }
        // Không gửi các trường thừa
      };

      console.log('Data to send:', customerData);

      if (isEditing && currentId !== null) {
        await updateKhachHang(currentId, customerData)
        alert('Cập nhật khách hàng thành công!')
        resetForm()
        loadKhachHang()
      } else {
        try {
          await createKhachHang(customerData)
          alert('Thêm khách hàng mới thành công!')
          resetForm()
          loadKhachHang()
        } catch (createError: any) {
          if (createError.message.includes('duplicate key')) {
            if (createError.message.includes('email')) {
              alert('Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.')
            } else if (createError.message.includes('sdt')) {
              alert('Số điện thoại đã tồn tại trong hệ thống. Vui lòng sử dụng số điện thoại khác.')
            } else {
              alert('Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.')
            }
          } else {
            alert(`Lỗi khi thêm khách hàng: ${createError.message}`)
          }
        }
      }
    } catch (error: any) {
      console.error("Error saving customer:", error)
      alert(`Lỗi: ${error.message}`)
    }
  }

  const handleEdit = (khachHang: KhachHang) => {
    setFormData({
      ho: khachHang.ho,
      ten: khachHang.ten,
      sdt: khachHang.sdt,
      email: khachHang.email,
      diaChi: {
        thonXom: khachHang.diaChi.thonXom,
        quanHuyen: khachHang.diaChi.quanHuyen,
        tinhThanhPho: khachHang.diaChi.tinhThanhPho,
      },
    })
    setCurrentId(khachHang.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await deleteKhachHang(id)
        loadKhachHang()
      } catch (error) {
        console.error("Error deleting customer:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      ho: "",
      ten: "",
      sdt: "",
      email: "",
      diaChi: {
        thonXom: "",
        quanHuyen: "",
        tinhThanhPho: "",
      },
    })
    setIsEditing(false)
    setCurrentId(null)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý khách hàng</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ</label>
              <Input name="ho" value={formData.ho} onChange={handleInputChange} placeholder="Nhập họ" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tên</label>
              <Input name="ten" value={formData.ten} onChange={handleInputChange} placeholder="Nhập tên" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <Input
                name="sdt"
                value={formData.sdt}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                type="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thôn/Xóm</label>
              <Input
                name="diaChi.thonXom"
                value={formData.diaChi?.thonXom}
                onChange={handleInputChange}
                placeholder="Nhập thôn/xóm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
              <Input
                name="diaChi.quanHuyen"
                value={formData.diaChi?.quanHuyen}
                onChange={handleInputChange}
                placeholder="Nhập quận/huyện"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
              <Input
                name="diaChi.tinhThanhPho"
                value={formData.diaChi?.tinhThanhPho}
                onChange={handleInputChange}
                placeholder="Nhập tỉnh/thành phố"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Danh sách khách hàng</h2>
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {khachHangs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  khachHangs.map((khachHang) => (
                    <TableRow key={khachHang.id}>
                      <TableCell>{khachHang.id}</TableCell>
                      <TableCell>{`${khachHang.ho} ${khachHang.ten}`}</TableCell>
                      <TableCell>{khachHang.sdt}</TableCell>
                      <TableCell>{khachHang.email}</TableCell>
                      <TableCell>
                        {[khachHang.diaChi.thonXom, khachHang.diaChi.quanHuyen, khachHang.diaChi.tinhThanhPho]
                          .filter(Boolean)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(khachHang)}>
                            Sửa
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(khachHang.id)}>
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
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

