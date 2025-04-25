package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeDoanhThuKhachHangDTO {
    private String id;
    private Long khachHangId;
    private String tenKhachHang;
    private String emailKhachHang;
    private BigDecimal tongDoanhThu;
    private Integer tongDonHang;
    private Map<String, BigDecimal> doanhThuTheoKy;
    private LocalDateTime capNhatLanCuoi;
}
