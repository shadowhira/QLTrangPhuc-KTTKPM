package com.example.statisticsservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "thong_ke_doanh_thu_khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ThongKeDoanhThuKhachHang {

    @Id
    private String id;

    private Long khachHangId;

    private String tenKhachHang;

    private String emailKhachHang;

    private BigDecimal tongDoanhThu;

    private Integer tongDonHang;

    private Map<String, BigDecimal> doanhThuTheoKy; // Map của kỳ đến doanh thu

    private LocalDateTime capNhatLanCuoi = LocalDateTime.now();
}
