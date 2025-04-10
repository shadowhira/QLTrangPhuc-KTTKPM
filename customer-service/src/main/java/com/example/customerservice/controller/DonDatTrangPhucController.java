package com.example.customerservice.controller;

import com.example.customerservice.dto.DonDatTrangPhucDTO;
import com.example.customerservice.service.DonDatTrangPhucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/don-dat-trang-phuc")
public class DonDatTrangPhucController {

    private final DonDatTrangPhucService donDatTrangPhucService;

    @Autowired
    public DonDatTrangPhucController(DonDatTrangPhucService donDatTrangPhucService) {
        this.donDatTrangPhucService = donDatTrangPhucService;
    }

    @GetMapping
    public ResponseEntity<List<DonDatTrangPhucDTO>> getAllDonDatTrangPhucs() {
        List<DonDatTrangPhucDTO> donDatTrangPhucs = donDatTrangPhucService.getAllDonDatTrangPhucs();
        return ResponseEntity.ok(donDatTrangPhucs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonDatTrangPhucDTO> getDonDatTrangPhucById(@PathVariable Long id) {
        DonDatTrangPhucDTO donDatTrangPhuc = donDatTrangPhucService.getDonDatTrangPhucById(id);
        return ResponseEntity.ok(donDatTrangPhuc);
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<List<DonDatTrangPhucDTO>> getDonDatTrangPhucsByKhachHangId(@PathVariable Long khachHangId) {
        List<DonDatTrangPhucDTO> donDatTrangPhucs = donDatTrangPhucService.getDonDatTrangPhucsByKhachHangId(khachHangId);
        return ResponseEntity.ok(donDatTrangPhucs);
    }

    @GetMapping("/khoang-thoi-gian")
    public ResponseEntity<List<DonDatTrangPhucDTO>> getDonDatTrangPhucsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<DonDatTrangPhucDTO> donDatTrangPhucs = donDatTrangPhucService.getDonDatTrangPhucsBetweenDates(startDate, endDate);
        return ResponseEntity.ok(donDatTrangPhucs);
    }

    @PostMapping
    public ResponseEntity<DonDatTrangPhucDTO> createDonDatTrangPhuc(@RequestBody DonDatTrangPhucDTO donDatTrangPhucDTO) {
        DonDatTrangPhucDTO createdDonDatTrangPhuc = donDatTrangPhucService.createDonDatTrangPhuc(donDatTrangPhucDTO);
        return new ResponseEntity<>(createdDonDatTrangPhuc, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<DonDatTrangPhucDTO> updateDonDatTrangPhucTrangThai(
            @PathVariable Long id,
            @RequestParam String trangThai) {
        DonDatTrangPhucDTO updatedDonDatTrangPhuc = donDatTrangPhucService.updateDonDatTrangPhucTrangThai(id, trangThai);
        return ResponseEntity.ok(updatedDonDatTrangPhuc);
    }
}
