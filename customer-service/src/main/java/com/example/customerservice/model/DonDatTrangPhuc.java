package com.example.customerservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "don_dat_trang_phuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DonDatTrangPhuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ngay_dat", nullable = false)
    private LocalDateTime ngayDat = LocalDateTime.now();

    @Column(name = "tong_tien", nullable = false)
    private BigDecimal tongTien = BigDecimal.ZERO;

    @Column(name = "trang_thai", nullable = false)
    private String trangThai = "Chờ xử lý";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    @JsonBackReference
    private KhachHang khachHang;

    @OneToMany(mappedBy = "donDatTrangPhuc", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ChiTietDonDat> chiTietDonDats = new ArrayList<>();

    // Helper method to add order detail
    public void addChiTietDonDat(ChiTietDonDat chiTietDonDat) {
        chiTietDonDats.add(chiTietDonDat);
        chiTietDonDat.setDonDatTrangPhuc(this);
        // Update total amount
        this.tongTien = this.tongTien.add(chiTietDonDat.getThanhTien());
    }

    // Helper method to remove order detail
    public void removeChiTietDonDat(ChiTietDonDat chiTietDonDat) {
        chiTietDonDats.remove(chiTietDonDat);
        chiTietDonDat.setDonDatTrangPhuc(null);
        // Update total amount
        this.tongTien = this.tongTien.subtract(chiTietDonDat.getThanhTien());
    }
}
