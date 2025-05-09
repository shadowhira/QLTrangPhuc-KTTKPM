package com.example.customerservice.service;

import com.example.customerservice.exception.ResourceNotFoundException;
import com.example.customerservice.model.KhachHang;
import com.example.customerservice.model.DonDatTrangPhuc;
import com.example.customerservice.model.ChiTietDonDat;
import com.example.customerservice.model.TrangPhuc;
import com.example.customerservice.repository.KhachHangRepository;
import com.example.customerservice.repository.DonDatTrangPhucRepository;
import com.example.customerservice.repository.TrangPhucRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonDatTrangPhucService {

    private final DonDatTrangPhucRepository donDatTrangPhucRepository;
    private final KhachHangRepository khachHangRepository;
    private final TrangPhucRepository trangPhucRepository;
    private final KhachHangService khachHangService;

    public DonDatTrangPhucService(DonDatTrangPhucRepository donDatTrangPhucRepository,
                       KhachHangRepository khachHangRepository,
                       TrangPhucRepository trangPhucRepository,
                       KhachHangService khachHangService) {
        this.donDatTrangPhucRepository = donDatTrangPhucRepository;
        this.khachHangRepository = khachHangRepository;
        this.trangPhucRepository = trangPhucRepository;
        this.khachHangService = khachHangService;
    }

    public List<DonDatTrangPhuc> getAllDonDatTrangPhucs() {
        return donDatTrangPhucRepository.findAll();
    }

    public DonDatTrangPhuc getDonDatTrangPhucById(Long id) {
        return donDatTrangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt trang phục không tìm thấy với id: " + id));
    }

    public List<DonDatTrangPhuc> getDonDatTrangPhucsByKhachHangId(Long khachHangId) {
        return donDatTrangPhucRepository.findByKhachHangId(khachHangId);
    }

    public List<DonDatTrangPhuc> getDonDatTrangPhucsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return donDatTrangPhucRepository.findDonDatTrangPhucBetweenDates(startDate, endDate);
    }

    @Transactional
    public DonDatTrangPhuc createDonDatTrangPhuc(DonDatTrangPhuc donDatTrangPhuc) {
        // Set ngayDat if not set
        if (donDatTrangPhuc.getNgayDat() == null) {
            donDatTrangPhuc.setNgayDat(LocalDateTime.now());
        }

        // Set trangThai if not set
        if (donDatTrangPhuc.getTrangThai() == null) {
            donDatTrangPhuc.setTrangThai("Chờ xử lý");
        }

        // Save the order
        DonDatTrangPhuc savedDonDatTrangPhuc = donDatTrangPhucRepository.save(donDatTrangPhuc);

        // Update khachHang's tongChiTieu
        if (savedDonDatTrangPhuc.getKhachHang() != null) {
            khachHangService.updateKhachHangTongChiTieu(
                savedDonDatTrangPhuc.getKhachHang().getId(),
                savedDonDatTrangPhuc.getTongTien().doubleValue()
            );
        }

        return savedDonDatTrangPhuc;
    }

    @Transactional
    public DonDatTrangPhuc updateDonDatTrangPhucTrangThai(Long id, String trangThai) {
        DonDatTrangPhuc donDatTrangPhuc = donDatTrangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt trang phục không tìm thấy với id: " + id));

        donDatTrangPhuc.setTrangThai(trangThai);
        return donDatTrangPhucRepository.save(donDatTrangPhuc);
    }
}
