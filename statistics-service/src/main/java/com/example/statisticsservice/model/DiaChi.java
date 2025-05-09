package com.example.statisticsservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiaChi {
    private Long id;
    private String thonXom;
    private String quanHuyen;
    private String tinhThanhPho;
}
