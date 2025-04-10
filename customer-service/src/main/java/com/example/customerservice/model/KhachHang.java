package com.example.customerservice.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "khach_hang")
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho", nullable = false)
    private String ho;

    @Column(name = "ten", nullable = false)
    private String ten;

    @Column(name = "sdt", nullable = false, unique = true)
    private String sdt;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "tong_chi_tieu", nullable = false)
    private Double tongChiTieu = 0.0;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dia_chi_id", referencedColumnName = "id")
    private DiaChi diaChi;

    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonDatTrangPhuc> donDatTrangPhucs = new ArrayList<>();

    public KhachHang() {
    }

    public KhachHang(Long id, String ho, String ten, String sdt, String email, Double tongChiTieu, DiaChi diaChi, List<DonDatTrangPhuc> donDatTrangPhucs) {
        this.id = id;
        this.ho = ho;
        this.ten = ten;
        this.sdt = sdt;
        this.email = email;
        this.tongChiTieu = tongChiTieu;
        this.diaChi = diaChi;
        this.donDatTrangPhucs = donDatTrangPhucs;
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

    public DiaChi getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(DiaChi diaChi) {
        this.diaChi = diaChi;
    }

    public List<DonDatTrangPhuc> getDonDatTrangPhucs() {
        return donDatTrangPhucs;
    }

    public void setDonDatTrangPhucs(List<DonDatTrangPhuc> donDatTrangPhucs) {
        this.donDatTrangPhucs = donDatTrangPhucs;
    }
}
