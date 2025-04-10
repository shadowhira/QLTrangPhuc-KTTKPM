package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonDatTrangPhucDTO {
    private Long id;
    private LocalDateTime ngayDat;
    private BigDecimal tongTien;
    private String trangThai;
    private Long khachHangId;
    private List<ChiTietDonDatDTO> chiTietDonDats;
}
