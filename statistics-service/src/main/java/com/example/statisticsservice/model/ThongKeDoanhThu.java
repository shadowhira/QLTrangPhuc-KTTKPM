package com.example.statisticsservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "thong_ke_doanh_thu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ThongKeDoanhThu {

    @Id
    private String id;

    private String kyThongKe; // "THANG", "QUY", "NAM"

    private String giaTriKy; // "2023-01", "2023-Q1", "2023"

    private LocalDateTime ngayBatDau;

    private LocalDateTime ngayKetThuc;

    private BigDecimal tongDoanhThu;

    private Integer tongDonHang;

    private LocalDateTime ngayTao = LocalDateTime.now();
}
