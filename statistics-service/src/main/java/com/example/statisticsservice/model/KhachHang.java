package com.example.statisticsservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KhachHang {
    private Long id;
    private String ho;
    private String ten;
    private String sdt;
    private String email;
    private Double tongChiTieu;
    private DiaChi diaChi;
}
