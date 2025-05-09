package com.example.statisticsservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DonDatTrangPhuc {
    private Long id;
    private LocalDateTime ngayDat;
    private BigDecimal tongTien;
    private String trangThai;
    private Long khachHangId;
    private List<ChiTietDonDat> chiTietDonDats;
}
