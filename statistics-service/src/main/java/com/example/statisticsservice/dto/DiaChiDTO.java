package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaChiDTO {
    private Long id;
    private String thonXom;
    private String quanHuyen;
    private String tinhThanhPho;
}
