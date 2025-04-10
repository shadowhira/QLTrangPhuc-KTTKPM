package com.example.customerservice.dto;

import java.math.BigDecimal;

public class TrangPhucDTO {
    private Long id;
    private String ten;
    private String loai;
    private BigDecimal giaThueNgay;
    private BigDecimal giaBan;
    private String trangThai;
    private String moTa;

    public TrangPhucDTO() {
    }

    public TrangPhucDTO(Long id, String ten, String loai, BigDecimal giaThueNgay, BigDecimal giaBan, String trangThai, String moTa) {
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
