package com.example.customerservice.dto;

import java.math.BigDecimal;

public class ChiTietDonDatDTO {
    private Long id;
    private Integer soLuongDat;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
    private Long trangPhucId;
    private String tenTrangPhuc;

    public ChiTietDonDatDTO() {
    }

    public ChiTietDonDatDTO(Long id, Integer soLuongDat, BigDecimal donGia, BigDecimal thanhTien, Long trangPhucId, String tenTrangPhuc) {
        this.id = id;
        this.soLuongDat = soLuongDat;
        this.donGia = donGia;
        this.thanhTien = thanhTien;
        this.trangPhucId = trangPhucId;
        this.tenTrangPhuc = tenTrangPhuc;
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

    public Long getTrangPhucId() {
        return trangPhucId;
    }

    public void setTrangPhucId(Long trangPhucId) {
        this.trangPhucId = trangPhucId;
    }

    public String getTenTrangPhuc() {
        return tenTrangPhuc;
    }

    public void setTenTrangPhuc(String tenTrangPhuc) {
        this.tenTrangPhuc = tenTrangPhuc;
    }
}
