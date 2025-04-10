package com.example.statisticsservice.service;

import com.example.statisticsservice.dto.DonDatTrangPhucDTO;
import com.example.statisticsservice.dto.RevenueStatisticsDTO;
import com.example.statisticsservice.exception.ResourceNotFoundException;
import com.example.statisticsservice.model.RevenueStatistics;
import com.example.statisticsservice.repository.RevenueStatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RevenueStatisticsService {

    private final RevenueStatisticsRepository revenueStatisticsRepository;
    private final CustomerServiceClient customerServiceClient;

    @Autowired
    public RevenueStatisticsService(RevenueStatisticsRepository revenueStatisticsRepository,
                                   CustomerServiceClient customerServiceClient) {
        this.revenueStatisticsRepository = revenueStatisticsRepository;
        this.customerServiceClient = customerServiceClient;
    }

    public List<RevenueStatisticsDTO> getAllRevenueStatistics() {
        return revenueStatisticsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RevenueStatisticsDTO getRevenueStatisticsById(String id) {
        RevenueStatistics statistics = revenueStatisticsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revenue statistics not found with id: " + id));
        return convertToDTO(statistics);
    }

    public List<RevenueStatisticsDTO> getRevenueStatisticsByPeriod(String period) {
        return revenueStatisticsRepository.findByPeriodOrderByPeriodValueDesc(period).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RevenueStatisticsDTO generateMonthlyStatistics(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        String periodValue = String.format("%d-%02d", year, month);

        // Check if statistics already exist
        RevenueStatistics existingStats = revenueStatisticsRepository
                .findByPeriodAndPeriodValue("MONTH", periodValue)
                .orElse(null);

        if (existingStats != null) {
            return convertToDTO(existingStats);
        }

        // Fetch orders from customer service
        List<DonDatTrangPhucDTO> donDatTrangPhucs = customerServiceClient.getDonDatTrangPhucsBetweenDates(startDate, endDate);

        // Calculate statistics
        BigDecimal totalRevenue = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalOrders = donDatTrangPhucs.size();

        // Create and save statistics
        RevenueStatistics statistics = new RevenueStatistics();
        statistics.setPeriod("MONTH");
        statistics.setPeriodValue(periodValue);
        statistics.setStartDate(startDate);
        statistics.setEndDate(endDate);
        statistics.setTotalRevenue(totalRevenue);
        statistics.setTotalOrders(totalOrders);
        statistics.setCreatedAt(LocalDateTime.now());

        RevenueStatistics savedStatistics = revenueStatisticsRepository.save(statistics);
        return convertToDTO(savedStatistics);
    }

    public RevenueStatisticsDTO generateQuarterlyStatistics(int year, int quarter) {
        if (quarter < 1 || quarter > 4) {
            throw new IllegalArgumentException("Quarter must be between 1 and 4");
        }

        Month startMonth = Month.of((quarter - 1) * 3 + 1);
        Month endMonth = Month.of(quarter * 3);

        LocalDateTime startDate = LocalDateTime.of(year, startMonth, 1, 0, 0);
        LocalDateTime endDate = YearMonth.of(year, endMonth).atEndOfMonth().atTime(23, 59, 59);

        String periodValue = String.format("%d-Q%d", year, quarter);

        // Check if statistics already exist
        RevenueStatistics existingStats = revenueStatisticsRepository
                .findByPeriodAndPeriodValue("QUARTER", periodValue)
                .orElse(null);

        if (existingStats != null) {
            return convertToDTO(existingStats);
        }

        // Fetch orders from customer service
        List<DonDatTrangPhucDTO> donDatTrangPhucs = customerServiceClient.getDonDatTrangPhucsBetweenDates(startDate, endDate);

        // Calculate statistics
        BigDecimal totalRevenue = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalOrders = donDatTrangPhucs.size();

        // Create and save statistics
        RevenueStatistics statistics = new RevenueStatistics();
        statistics.setPeriod("QUARTER");
        statistics.setPeriodValue(periodValue);
        statistics.setStartDate(startDate);
        statistics.setEndDate(endDate);
        statistics.setTotalRevenue(totalRevenue);
        statistics.setTotalOrders(totalOrders);
        statistics.setCreatedAt(LocalDateTime.now());

        RevenueStatistics savedStatistics = revenueStatisticsRepository.save(statistics);
        return convertToDTO(savedStatistics);
    }

    public RevenueStatisticsDTO generateYearlyStatistics(int year) {
        LocalDateTime startDate = Year.of(year).atMonth(1).atDay(1).atStartOfDay();
        LocalDateTime endDate = Year.of(year).atMonth(12).atEndOfMonth().atTime(23, 59, 59);

        String periodValue = String.valueOf(year);

        // Check if statistics already exist
        RevenueStatistics existingStats = revenueStatisticsRepository
                .findByPeriodAndPeriodValue("YEAR", periodValue)
                .orElse(null);

        if (existingStats != null) {
            return convertToDTO(existingStats);
        }

        // Fetch orders from customer service
        List<DonDatTrangPhucDTO> donDatTrangPhucs = customerServiceClient.getDonDatTrangPhucsBetweenDates(startDate, endDate);

        // Calculate statistics
        BigDecimal totalRevenue = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalOrders = donDatTrangPhucs.size();

        // Create and save statistics
        RevenueStatistics statistics = new RevenueStatistics();
        statistics.setPeriod("YEAR");
        statistics.setPeriodValue(periodValue);
        statistics.setStartDate(startDate);
        statistics.setEndDate(endDate);
        statistics.setTotalRevenue(totalRevenue);
        statistics.setTotalOrders(totalOrders);
        statistics.setCreatedAt(LocalDateTime.now());

        RevenueStatistics savedStatistics = revenueStatisticsRepository.save(statistics);
        return convertToDTO(savedStatistics);
    }

    // Helper methods to convert between Entity and DTO
    private RevenueStatisticsDTO convertToDTO(RevenueStatistics statistics) {
        RevenueStatisticsDTO dto = new RevenueStatisticsDTO();
        dto.setId(statistics.getId());
        dto.setPeriod(statistics.getPeriod());
        dto.setPeriodValue(statistics.getPeriodValue());
        dto.setStartDate(statistics.getStartDate());
        dto.setEndDate(statistics.getEndDate());
        dto.setTotalRevenue(statistics.getTotalRevenue());
        dto.setTotalOrders(statistics.getTotalOrders());
        dto.setCreatedAt(statistics.getCreatedAt());
        return dto;
    }
}
