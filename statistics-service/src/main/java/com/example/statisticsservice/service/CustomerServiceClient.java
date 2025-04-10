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
public class CustomerServiceClient {

    private final WebClient webClient;

    @Autowired
    public CustomerServiceClient(WebClient.Builder webClientBuilder,
                                @Value("${customer.service.url}") String customerServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(customerServiceUrl).build();
    }

    public List<KhachHangDTO> getAllKhachHangs() {
        return webClient.get()
                .uri("/api/khach-hang")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<KhachHangDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Error fetching khach hangs: " + e.getMessage())))
                .block();
    }

    public KhachHangDTO getKhachHangById(Long id) {
        return webClient.get()
                .uri("/api/khach-hang/{id}", id)
                .retrieve()
                .bodyToMono(KhachHangDTO.class)
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Error fetching khach hang with id " + id + ": " + e.getMessage())))
                .block();
    }

    public List<KhachHangDTO> getKhachHangsByTongChiTieu() {
        return webClient.get()
                .uri("/api/khach-hang/theo-chi-tieu")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<KhachHangDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Error fetching khach hangs by tong chi tieu: " + e.getMessage())))
                .block();
    }

    public List<DonDatTrangPhucDTO> getDonDatTrangPhucsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/don-dat-trang-phuc/khoang-thoi-gian")
                        .queryParam("startDate", startDate.format(formatter))
                        .queryParam("endDate", endDate.format(formatter))
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<DonDatTrangPhucDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Error fetching don dat trang phucs between dates: " + e.getMessage())))
                .block();
    }

    public List<DonDatTrangPhucDTO> getDonDatTrangPhucsByKhachHangId(Long khachHangId) {
        return webClient.get()
                .uri("/api/don-dat-trang-phuc/khach-hang/{khachHangId}", khachHangId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<DonDatTrangPhucDTO>>() {})
                .onErrorResume(e -> Mono.error(new ServiceCommunicationException("Error fetching don dat trang phucs for khach hang " + khachHangId + ": " + e.getMessage())))
                .block();
    }
}
