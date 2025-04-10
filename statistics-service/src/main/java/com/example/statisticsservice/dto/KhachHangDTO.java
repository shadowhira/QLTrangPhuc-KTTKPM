package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangDTO {
    private Long id;
    private String ho;
    private String ten;
    private String sdt;
    private String email;
    private Double tongChiTieu;
    private DiaChiDTO diaChi;
}
