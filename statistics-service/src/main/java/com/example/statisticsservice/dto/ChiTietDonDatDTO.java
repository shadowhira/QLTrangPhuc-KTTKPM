package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDonDatDTO {
    private Long id;
    private Integer soLuongDat;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
    private Long trangPhucId;
    private String tenTrangPhuc;
}
