package com.example.statisticsservice.service;

import com.example.statisticsservice.model.KhachHang;
import com.example.statisticsservice.model.DonDatTrangPhuc;
import com.example.statisticsservice.exception.ServiceCommunicationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class KhachHangServiceClient {

    private final WebClient webClient;

    public KhachHangServiceClient(WebClient.Builder webClientBuilder,
                                @Value("${customer.service.url}") String customerServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(customerServiceUrl).build();
    }

    public List<KhachHang> layTatCaKhachHang() {
        try {
            return webClient.get()
                    .uri("/api/khach-hang")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<KhachHang>>() {})
                    .onErrorResume(e -> {
                        // Log chi tiết lỗi
                        System.err.println("Lỗi khi lấy danh sách khách hàng: " + e.getMessage());
                        e.printStackTrace();
                        return Mono.error(new ServiceCommunicationException("Lỗi khi lấy danh sách khách hàng: " + e.getMessage()));
                    })
                    .block();
        } catch (Exception e) {
            System.err.println("Exception khi lấy danh sách khách hàng: " + e.getMessage());
            e.printStackTrace();
            // Trả về danh sách rỗng thay vì ném ngoại lệ để tránh lỗi 503
            return new ArrayList<>();
        }
    }

    public KhachHang layKhachHangTheoId(Long id) {
        return webClient.get()
                .uri("/api/khach-hang/{id}", id)
                .retrieve()
                .bodyToMono(KhachHang.class)
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy khách hàng với id " + id + ": " + e.getMessage())))
                .block();
    }

    public List<KhachHang> layKhachHangTheoTongChiTieu() {
        return webClient.get()
                .uri("/api/khach-hang/theo-chi-tieu")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<KhachHang>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Lỗi khi lấy khách hàng theo tổng chi tiêu: " + e.getMessage())))
                .block();
    }

    public List<DonDatTrangPhuc> layDonDatTrangPhucTheoKhoangThoiGian(LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/don-dat-trang-phuc/khoang-thoi-gian")
                            .queryParam("startDate", ngayBatDau.format(formatter))
                            .queryParam("endDate", ngayKetThuc.format(formatter))
                            .build())
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<DonDatTrangPhuc>>() {})
                    .onErrorResume(e -> {
                        // Log chi tiết lỗi
                        System.err.println("Lỗi khi lấy đơn đặt trang phục trong khoảng thời gian: " + e.getMessage());
                        e.printStackTrace();
                        return Mono.error(new ServiceCommunicationException("Lỗi khi lấy đơn đặt trang phục trong khoảng thời gian: " + e.getMessage()));
                    })
                    .block();
        } catch (Exception e) {
            System.err.println("Exception khi lấy đơn đặt trang phục trong khoảng thời gian: " + e.getMessage());
            e.printStackTrace();
            // Trả về danh sách rỗng thay vì ném ngoại lệ để tránh lỗi 503
            return new ArrayList<>();
        }
    }

    public List<DonDatTrangPhuc> layDonDatTrangPhucTheoKhachHangId(Long khachHangId) {
        try {
            return webClient.get()
                    .uri("/api/don-dat-trang-phuc/khach-hang/{khachHangId}", khachHangId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<DonDatTrangPhuc>>() {})
                    .onErrorResume(e -> {
                        // Log chi tiết lỗi
                        System.err.println("Lỗi khi lấy đơn đặt trang phục cho khách hàng " + khachHangId + ": " + e.getMessage());
                        e.printStackTrace();
                        return Mono.error(new ServiceCommunicationException("Lỗi khi lấy đơn đặt trang phục cho khách hàng " + khachHangId + ": " + e.getMessage()));
                    })
                    .block();
        } catch (Exception e) {
            System.err.println("Exception khi lấy đơn đặt trang phục cho khách hàng " + khachHangId + ": " + e.getMessage());
            e.printStackTrace();
            // Trả về danh sách rỗng thay vì ném ngoại lệ để tránh lỗi 503
            return new ArrayList<>();
        }
    }
}
