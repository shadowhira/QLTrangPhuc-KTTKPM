package com.example.customerservice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "trang_phuc")
public class TrangPhuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten", nullable = false)
    private String ten;

    @Column(name = "loai", nullable = false)
    private String loai;

    @Column(name = "gia_thue_ngay", nullable = false)
    private BigDecimal giaThueNgay;

    @Column(name = "gia_ban", nullable = false)
    private BigDecimal giaBan;

    @Column(name = "trang_thai", nullable = false)
    private String trangThai = "Có sẵn";

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    public TrangPhuc() {
    }

    public TrangPhuc(Long id, String ten, String loai, BigDecimal giaThueNgay, BigDecimal giaBan, String trangThai, String moTa) {
        this.id = id;
        this.ten = ten;
        this.loai = loai;
        this.giaThueNgay = giaThueNgay;
        this.giaBan = giaBan;
        this.trangThai = trangThai;
        this.moTa = moTa;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getLoai() {
        return loai;
    }

    public void setLoai(String loai) {
        this.loai = loai;
    }

    public BigDecimal getGiaThueNgay() {
        return giaThueNgay;
    }

    public void setGiaThueNgay(BigDecimal giaThueNgay) {
        this.giaThueNgay = giaThueNgay;
    }

    public BigDecimal getGiaBan() {
        return giaBan;
    }

    public void setGiaBan(BigDecimal giaBan) {
        this.giaBan = giaBan;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }
}
