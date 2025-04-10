package com.example.customerservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dia_chi")
public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thon_xom")
    private String thonXom;

    @Column(name = "quan_huyen")
    private String quanHuyen;

    @Column(name = "tinh_thanh_pho")
    private String tinhThanhPho;

    public DiaChi() {
    }

    public DiaChi(Long id, String thonXom, String quanHuyen, String tinhThanhPho) {
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
