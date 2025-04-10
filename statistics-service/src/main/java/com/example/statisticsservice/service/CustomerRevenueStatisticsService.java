package com.example.statisticsservice.service;

import com.example.statisticsservice.dto.KhachHangDTO;
import com.example.statisticsservice.dto.CustomerRevenueStatisticsDTO;
import com.example.statisticsservice.dto.DonDatTrangPhucDTO;
import com.example.statisticsservice.exception.ResourceNotFoundException;
import com.example.statisticsservice.model.CustomerRevenueStatistics;
import com.example.statisticsservice.repository.CustomerRevenueStatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CustomerRevenueStatisticsService {

    private final CustomerRevenueStatisticsRepository customerRevenueStatisticsRepository;
    private final CustomerServiceClient customerServiceClient;

    @Autowired
    public CustomerRevenueStatisticsService(CustomerRevenueStatisticsRepository customerRevenueStatisticsRepository,
                                           CustomerServiceClient customerServiceClient) {
        this.customerRevenueStatisticsRepository = customerRevenueStatisticsRepository;
        this.customerServiceClient = customerServiceClient;
    }

    public List<CustomerRevenueStatisticsDTO> getAllCustomerRevenueStatistics() {
        return customerRevenueStatisticsRepository.findAllByOrderByTotalRevenueDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerRevenueStatisticsDTO getCustomerRevenueStatisticsById(String id) {
        CustomerRevenueStatistics statistics = customerRevenueStatisticsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer revenue statistics not found with id: " + id));
        return convertToDTO(statistics);
    }

    public CustomerRevenueStatisticsDTO getCustomerRevenueStatisticsByCustomerId(Long customerId) {
        CustomerRevenueStatistics statistics = customerRevenueStatisticsRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer revenue statistics not found for customer id: " + customerId));
        return convertToDTO(statistics);
    }

    public List<CustomerRevenueStatisticsDTO> generateAllCustomerRevenueStatistics() {
        // Fetch all customers
        List<KhachHangDTO> khachHangs = customerServiceClient.getAllKhachHangs();

        // Generate statistics for each customer
        List<CustomerRevenueStatistics> allStatistics = khachHangs.stream()
                .map(this::generateCustomerRevenueStatistics)
                .collect(Collectors.toList());

        // Save all statistics
        List<CustomerRevenueStatistics> savedStatistics = customerRevenueStatisticsRepository.saveAll(allStatistics);

        return savedStatistics.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerRevenueStatisticsDTO generateCustomerRevenueStatisticsById(Long customerId) {
        // Fetch customer
        KhachHangDTO khachHang = customerServiceClient.getKhachHangById(customerId);

        // Generate statistics
        CustomerRevenueStatistics statistics = generateCustomerRevenueStatistics(khachHang);

        // Save statistics
        CustomerRevenueStatistics savedStatistics = customerRevenueStatisticsRepository.save(statistics);

        return convertToDTO(savedStatistics);
    }

    private CustomerRevenueStatistics generateCustomerRevenueStatistics(KhachHangDTO khachHang) {
        // Fetch orders for customer
        List<DonDatTrangPhucDTO> donDatTrangPhucs = customerServiceClient.getDonDatTrangPhucsByKhachHangId(khachHang.getId());

        // Calculate total revenue
        BigDecimal totalRevenue = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate revenue by period (month)
        Map<String, BigDecimal> revenueByPeriod = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .forEach(donDat -> {
                    String period = donDat.getNgayDat().format(formatter);
                    revenueByPeriod.merge(period, donDat.getTongTien(), BigDecimal::add);
                });

        // Create or update statistics
        CustomerRevenueStatistics statistics = customerRevenueStatisticsRepository.findByCustomerId(khachHang.getId())
                .orElse(new CustomerRevenueStatistics());

        statistics.setCustomerId(khachHang.getId());
        statistics.setCustomerName(khachHang.getHo() + " " + khachHang.getTen());
        statistics.setCustomerEmail(khachHang.getEmail());
        statistics.setTotalRevenue(totalRevenue);
        statistics.setTotalOrders(donDatTrangPhucs.size());
        statistics.setRevenueByPeriod(revenueByPeriod);
        statistics.setLastUpdated(LocalDateTime.now());

        return statistics;
    }

    // Helper methods to convert between Entity and DTO
    private CustomerRevenueStatisticsDTO convertToDTO(CustomerRevenueStatistics statistics) {
        CustomerRevenueStatisticsDTO dto = new CustomerRevenueStatisticsDTO();
        dto.setId(statistics.getId());
        dto.setCustomerId(statistics.getCustomerId());
        dto.setCustomerName(statistics.getCustomerName());
        dto.setCustomerEmail(statistics.getCustomerEmail());
        dto.setTotalRevenue(statistics.getTotalRevenue());
        dto.setTotalOrders(statistics.getTotalOrders());
        dto.setRevenueByPeriod(statistics.getRevenueByPeriod());
        dto.setLastUpdated(statistics.getLastUpdated());
        return dto;
    }
}
