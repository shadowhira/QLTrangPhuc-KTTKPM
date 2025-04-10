package com.example.customerservice.dto;

public class KhachHangDTO {
    private Long id;
    private String ho;
    private String ten;
    private String sdt;
    private String email;
    private Double tongChiTieu;
    private DiaChiDTO diaChi;

    public KhachHangDTO() {
    }

    public KhachHangDTO(Long id, String ho, String ten, String sdt, String email, Double tongChiTieu, DiaChiDTO diaChi) {
        this.id = id;
        this.ho = ho;
        this.ten = ten;
        this.sdt = sdt;
        this.email = email;
        this.tongChiTieu = tongChiTieu;
        this.diaChi = diaChi;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHo() {
        return ho;
    }

    public void setHo(String ho) {
        this.ho = ho;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getTongChiTieu() {
        return tongChiTieu;
    }

    public void setTongChiTieu(Double tongChiTieu) {
        this.tongChiTieu = tongChiTieu;
    }

    public DiaChiDTO getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(DiaChiDTO diaChi) {
        this.diaChi = diaChi;
    }
}
