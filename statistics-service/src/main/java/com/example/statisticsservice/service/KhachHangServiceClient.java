package com.example.statisticsservice.service;

import com.example.statisticsservice.dto.KhachHangDTO;
import com.example.statisticsservice.dto.DonDatTrangPhucDTO;
import com.example.statisticsservice.exception.ServiceCommunicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class KhachHangServiceClient {

    private final WebClient webClient;

    @Autowired
    public KhachHangServiceClient(WebClient.Builder webClientBuilder,
                                @Value("${customer.service.url}") String customerServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(customerServiceUrl).build();
    }

    public List<KhachHangDTO> layTatCaKhachHang() {
        return webClient.get()
                .uri("/api/khach-hang")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<KhachHangDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy danh sách khách hàng: " + e.getMessage())))
                .block();
    }

    public KhachHangDTO layKhachHangTheoId(Long id) {
        return webClient.get()
                .uri("/api/khach-hang/{id}", id)
                .retrieve()
                .bodyToMono(KhachHangDTO.class)
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy khách hàng với id " + id + ": " + e.getMessage())))
                .block();
    }

    public List<KhachHangDTO> layKhachHangTheoTongChiTieu() {
        return webClient.get()
                .uri("/api/khach-hang/theo-chi-tieu")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<KhachHangDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy khách hàng theo tổng chi tiêu: " + e.getMessage())))
                .block();
    }

    public List<DonDatTrangPhucDTO> layDonDatTrangPhucTheoKhoangThoiGian(LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/don-dat-trang-phuc/khoang-thoi-gian")
                        .queryParam("startDate", ngayBatDau.format(formatter))
                        .queryParam("endDate", ngayKetThuc.format(formatter))
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<DonDatTrangPhucDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy đơn đặt trang phục trong khoảng thời gian: " + e.getMessage())))
                .block();
    }

    public List<DonDatTrangPhucDTO> layDonDatTrangPhucTheoKhachHangId(Long khachHangId) {
        return webClient.get()
                .uri("/api/don-dat-trang-phuc/khach-hang/{khachHangId}", khachHangId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<DonDatTrangPhucDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy đơn đặt trang phục cho khách hàng " + khachHangId + ": " + e.getMessage())))
                .block();
    }
}
