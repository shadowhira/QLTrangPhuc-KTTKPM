package com.example.customerservice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "don_dat_trang_phuc")
public class DonDatTrangPhuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ngay_dat", nullable = false)
    private LocalDateTime ngayDat = LocalDateTime.now();

    @Column(name = "tong_tien", nullable = false)
    private BigDecimal tongTien = BigDecimal.ZERO;

    @Column(name = "trang_thai", nullable = false)
    private String trangThai = "Chờ xử lý";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

    @OneToMany(mappedBy = "donDatTrangPhuc", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonDat> chiTietDonDats = new ArrayList<>();

    public DonDatTrangPhuc() {
    }

    public DonDatTrangPhuc(Long id, LocalDateTime ngayDat, BigDecimal tongTien, String trangThai, KhachHang khachHang, List<ChiTietDonDat> chiTietDonDats) {
        this.id = id;
        this.ngayDat = ngayDat;
        this.tongTien = tongTien;
        this.trangThai = trangThai;
        this.khachHang = khachHang;
        this.chiTietDonDats = chiTietDonDats;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getNgayDat() {
        return ngayDat;
    }

    public void setNgayDat(LocalDateTime ngayDat) {
        this.ngayDat = ngayDat;
    }

    public BigDecimal getTongTien() {
        return tongTien;
    }

    public void setTongTien(BigDecimal tongTien) {
        this.tongTien = tongTien;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    public List<ChiTietDonDat> getChiTietDonDats() {
        return chiTietDonDats;
    }

    public void setChiTietDonDats(List<ChiTietDonDat> chiTietDonDats) {
        this.chiTietDonDats = chiTietDonDats;
    }

    // Helper method to add order detail
    public void addChiTietDonDat(ChiTietDonDat chiTietDonDat) {
        chiTietDonDats.add(chiTietDonDat);
        chiTietDonDat.setDonDatTrangPhuc(this);
        // Update total amount
        this.tongTien = this.tongTien.add(chiTietDonDat.getThanhTien());
    }

    // Helper method to remove order detail
    public void removeChiTietDonDat(ChiTietDonDat chiTietDonDat) {
        chiTietDonDats.remove(chiTietDonDat);
        chiTietDonDat.setDonDatTrangPhuc(null);
        // Update total amount
        this.tongTien = this.tongTien.subtract(chiTietDonDat.getThanhTien());
    }
}
