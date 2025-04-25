package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeDoanhThuDTO {
    private String id;
    private String kyThongKe;
    private String giaTriKy;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private BigDecimal tongDoanhThu;
    private Integer tongDonHang;
    private LocalDateTime ngayTao;
}
