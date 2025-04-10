package com.example.customerservice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_dat")
public class ChiTietDonDat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "so_luong_dat", nullable = false)
    private Integer soLuongDat;

    @Column(name = "don_gia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "thanh_tien", nullable = false)
    private BigDecimal thanhTien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_dat_trang_phuc_id", nullable = false)
    private DonDatTrangPhuc donDatTrangPhuc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trang_phuc_id", nullable = false)
    private TrangPhuc trangPhuc;

    public ChiTietDonDat() {
    }

    public ChiTietDonDat(Long id, Integer soLuongDat, BigDecimal donGia, BigDecimal thanhTien, DonDatTrangPhuc donDatTrangPhuc, TrangPhuc trangPhuc) {
        this.id = id;
        this.soLuongDat = soLuongDat;
        this.donGia = donGia;
        this.thanhTien = thanhTien;
        this.donDatTrangPhuc = donDatTrangPhuc;
        this.trangPhuc = trangPhuc;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSoLuongDat() {
        return soLuongDat;
    }

    public void setSoLuongDat(Integer soLuongDat) {
        this.soLuongDat = soLuongDat;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }

    public BigDecimal getThanhTien() {
        return thanhTien;
    }

    public void setThanhTien(BigDecimal thanhTien) {
        this.thanhTien = thanhTien;
    }

    public DonDatTrangPhuc getDonDatTrangPhuc() {
        return donDatTrangPhuc;
    }

    public void setDonDatTrangPhuc(DonDatTrangPhuc donDatTrangPhuc) {
        this.donDatTrangPhuc = donDatTrangPhuc;
    }

    public TrangPhuc getTrangPhuc() {
        return trangPhuc;
    }

    public void setTrangPhuc(TrangPhuc trangPhuc) {
        this.trangPhuc = trangPhuc;
    }

    // Calculate subtotal
    @PrePersist
    @PreUpdate
    public void calculateThanhTien() {
        this.thanhTien = this.donGia.multiply(BigDecimal.valueOf(this.soLuongDat));
    }
}
