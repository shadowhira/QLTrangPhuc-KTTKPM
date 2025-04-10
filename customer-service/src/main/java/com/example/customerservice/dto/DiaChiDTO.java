package com.example.customerservice.dto;

public class DiaChiDTO {
    private Long id;
    private String thonXom;
    private String quanHuyen;
    private String tinhThanhPho;

    public DiaChiDTO() {
    }

    public DiaChiDTO(Long id, String thonXom, String quanHuyen, String tinhThanhPho) {
        this.id = id;
        this.thonXom = thonXom;
        this.quanHuyen = quanHuyen;
        this.tinhThanhPho = tinhThanhPho;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getThonXom() {
        return thonXom;
    }

    public void setThonXom(String thonXom) {
        this.thonXom = thonXom;
    }

    public String getQuanHuyen() {
        return quanHuyen;
    }

    public void setQuanHuyen(String quanHuyen) {
        this.quanHuyen = quanHuyen;
    }

    public String getTinhThanhPho() {
        return tinhThanhPho;
    }

    public void setTinhThanhPho(String tinhThanhPho) {
        this.tinhThanhPho = tinhThanhPho;
    }
}
