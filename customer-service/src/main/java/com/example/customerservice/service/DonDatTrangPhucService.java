package com.example.customerservice.service;

import com.example.customerservice.dto.DonDatTrangPhucDTO;
import com.example.customerservice.dto.ChiTietDonDatDTO;
import com.example.customerservice.exception.ResourceNotFoundException;
import com.example.customerservice.model.KhachHang;
import com.example.customerservice.model.DonDatTrangPhuc;
import com.example.customerservice.model.ChiTietDonDat;
import com.example.customerservice.model.TrangPhuc;
import com.example.customerservice.repository.KhachHangRepository;
import com.example.customerservice.repository.DonDatTrangPhucRepository;
import com.example.customerservice.repository.TrangPhucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonDatTrangPhucService {

    private final DonDatTrangPhucRepository donDatTrangPhucRepository;
    private final KhachHangRepository khachHangRepository;
    private final TrangPhucRepository trangPhucRepository;
    private final KhachHangService khachHangService;

    @Autowired
    public DonDatTrangPhucService(DonDatTrangPhucRepository donDatTrangPhucRepository,
                       KhachHangRepository khachHangRepository,
                       TrangPhucRepository trangPhucRepository,
                       KhachHangService khachHangService) {
        this.donDatTrangPhucRepository = donDatTrangPhucRepository;
        this.khachHangRepository = khachHangRepository;
        this.trangPhucRepository = trangPhucRepository;
        this.khachHangService = khachHangService;
    }

    public List<DonDatTrangPhucDTO> getAllDonDatTrangPhucs() {
        return donDatTrangPhucRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DonDatTrangPhucDTO getDonDatTrangPhucById(Long id) {
        DonDatTrangPhuc donDatTrangPhuc = donDatTrangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt trang phục không tìm thấy với id: " + id));
        return convertToDTO(donDatTrangPhuc);
    }

    public List<DonDatTrangPhucDTO> getDonDatTrangPhucsByKhachHangId(Long khachHangId) {
        return donDatTrangPhucRepository.findByKhachHangId(khachHangId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DonDatTrangPhucDTO> getDonDatTrangPhucsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return donDatTrangPhucRepository.findDonDatTrangPhucBetweenDates(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DonDatTrangPhucDTO createDonDatTrangPhuc(DonDatTrangPhucDTO donDatTrangPhucDTO) {
        DonDatTrangPhuc donDatTrangPhuc = new DonDatTrangPhuc();

        // Set khachHang
        KhachHang khachHang = khachHangRepository.findById(donDatTrangPhucDTO.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + donDatTrangPhucDTO.getKhachHangId()));
        donDatTrangPhuc.setKhachHang(khachHang);

        // Set ngayDat
        donDatTrangPhuc.setNgayDat(LocalDateTime.now());

        // Set trangThai
        donDatTrangPhuc.setTrangThai("Chờ xử lý");

        // Create donDatTrangPhuc first to get ID
        DonDatTrangPhuc savedDonDatTrangPhuc = donDatTrangPhucRepository.save(donDatTrangPhuc);

        // Add chi tiet don dat
        if (donDatTrangPhucDTO.getChiTietDonDats() != null && !donDatTrangPhucDTO.getChiTietDonDats().isEmpty()) {
            for (ChiTietDonDatDTO detailDTO : donDatTrangPhucDTO.getChiTietDonDats()) {
                TrangPhuc trangPhuc = trangPhucRepository.findById(detailDTO.getTrangPhucId())
                        .orElseThrow(() -> new ResourceNotFoundException("Trang phục không tìm thấy với id: " + detailDTO.getTrangPhucId()));

                ChiTietDonDat chiTietDonDat = new ChiTietDonDat();
                chiTietDonDat.setDonDatTrangPhuc(savedDonDatTrangPhuc);
                chiTietDonDat.setTrangPhuc(trangPhuc);
                chiTietDonDat.setSoLuongDat(detailDTO.getSoLuongDat());
                chiTietDonDat.setDonGia(trangPhuc.getGiaBan());
                chiTietDonDat.calculateThanhTien();

                savedDonDatTrangPhuc.addChiTietDonDat(chiTietDonDat);
            }
        }

        // Update donDatTrangPhuc with details
        DonDatTrangPhuc updatedDonDatTrangPhuc = donDatTrangPhucRepository.save(savedDonDatTrangPhuc);

        // Update khachHang's tongChiTieu
        khachHangService.updateKhachHangTongChiTieu(khachHang.getId(), updatedDonDatTrangPhuc.getTongTien().doubleValue());

        return convertToDTO(updatedDonDatTrangPhuc);
    }

    @Transactional
    public DonDatTrangPhucDTO updateDonDatTrangPhucTrangThai(Long id, String trangThai) {
        DonDatTrangPhuc donDatTrangPhuc = donDatTrangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt trang phục không tìm thấy với id: " + id));

        donDatTrangPhuc.setTrangThai(trangThai);
        DonDatTrangPhuc updatedDonDatTrangPhuc = donDatTrangPhucRepository.save(donDatTrangPhuc);

        return convertToDTO(updatedDonDatTrangPhuc);
    }

    // Helper methods to convert between Entity and DTO
    private DonDatTrangPhucDTO convertToDTO(DonDatTrangPhuc donDatTrangPhuc) {
        DonDatTrangPhucDTO dto = new DonDatTrangPhucDTO();
        dto.setId(donDatTrangPhuc.getId());
        dto.setNgayDat(donDatTrangPhuc.getNgayDat());
        dto.setTongTien(donDatTrangPhuc.getTongTien());
        dto.setTrangThai(donDatTrangPhuc.getTrangThai());
        dto.setKhachHangId(donDatTrangPhuc.getKhachHang().getId());

        List<ChiTietDonDatDTO> chiTietDonDatDTOs = new ArrayList<>();
        for (ChiTietDonDat chiTietDonDat : donDatTrangPhuc.getChiTietDonDats()) {
            ChiTietDonDatDTO chiTietDonDatDTO = new ChiTietDonDatDTO();
            chiTietDonDatDTO.setId(chiTietDonDat.getId());
            chiTietDonDatDTO.setSoLuongDat(chiTietDonDat.getSoLuongDat());
            chiTietDonDatDTO.setDonGia(chiTietDonDat.getDonGia());
            chiTietDonDatDTO.setThanhTien(chiTietDonDat.getThanhTien());
            chiTietDonDatDTO.setTrangPhucId(chiTietDonDat.getTrangPhuc().getId());
            chiTietDonDatDTO.setTenTrangPhuc(chiTietDonDat.getTrangPhuc().getTen());

            chiTietDonDatDTOs.add(chiTietDonDatDTO);
        }

        dto.setChiTietDonDats(chiTietDonDatDTOs);

        return dto;
    }
}
