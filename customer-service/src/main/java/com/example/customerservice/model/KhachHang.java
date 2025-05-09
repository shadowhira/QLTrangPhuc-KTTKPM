package com.example.customerservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
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
    @JsonManagedReference
    private List<DonDatTrangPhuc> donDatTrangPhucs = new ArrayList<>();
}
