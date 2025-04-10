package com.example.customerservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DonDatTrangPhucDTO {
    private Long id;
    private LocalDateTime ngayDat;
    private BigDecimal tongTien;
    private String trangThai;
    private Long khachHangId;
    private List<ChiTietDonDatDTO> chiTietDonDats;

    public DonDatTrangPhucDTO() {
    }

    public DonDatTrangPhucDTO(Long id, LocalDateTime ngayDat, BigDecimal tongTien, String trangThai, Long khachHangId, List<ChiTietDonDatDTO> chiTietDonDats) {
        this.id = id;
        this.ngayDat = ngayDat;
        this.tongTien = tongTien;
        this.trangThai = trangThai;
        this.khachHangId = khachHangId;
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

    public Long getKhachHangId() {
        return khachHangId;
    }

    public void setKhachHangId(Long khachHangId) {
        this.khachHangId = khachHangId;
    }

    public List<ChiTietDonDatDTO> getChiTietDonDats() {
        return chiTietDonDats;
    }

    public void setChiTietDonDats(List<ChiTietDonDatDTO> chiTietDonDats) {
        this.chiTietDonDats = chiTietDonDats;
    }
}
