package com.example.customerservice.controller;

import com.example.customerservice.model.DonDatTrangPhuc;
import com.example.customerservice.service.DonDatTrangPhucService;
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

    public DonDatTrangPhucController(DonDatTrangPhucService donDatTrangPhucService) {
        this.donDatTrangPhucService = donDatTrangPhucService;
    }

    @GetMapping
    public ResponseEntity<List<DonDatTrangPhuc>> getAllDonDatTrangPhucs() {
        List<DonDatTrangPhuc> donDatTrangPhucs = donDatTrangPhucService.getAllDonDatTrangPhucs();
        return ResponseEntity.ok(donDatTrangPhucs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonDatTrangPhuc> getDonDatTrangPhucById(@PathVariable Long id) {
        DonDatTrangPhuc donDatTrangPhuc = donDatTrangPhucService.getDonDatTrangPhucById(id);
        return ResponseEntity.ok(donDatTrangPhuc);
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<List<DonDatTrangPhuc>> getDonDatTrangPhucsByKhachHangId(@PathVariable Long khachHangId) {
        List<DonDatTrangPhuc> donDatTrangPhucs = donDatTrangPhucService.getDonDatTrangPhucsByKhachHangId(khachHangId);
        return ResponseEntity.ok(donDatTrangPhucs);
    }

    @GetMapping("/khoang-thoi-gian")
    public ResponseEntity<List<DonDatTrangPhuc>> getDonDatTrangPhucsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<DonDatTrangPhuc> donDatTrangPhucs = donDatTrangPhucService.getDonDatTrangPhucsBetweenDates(startDate, endDate);
        return ResponseEntity.ok(donDatTrangPhucs);
    }

    @PostMapping
    public ResponseEntity<DonDatTrangPhuc> createDonDatTrangPhuc(@RequestBody DonDatTrangPhuc donDatTrangPhuc) {
        DonDatTrangPhuc createdDonDatTrangPhuc = donDatTrangPhucService.createDonDatTrangPhuc(donDatTrangPhuc);
        return new ResponseEntity<>(createdDonDatTrangPhuc, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<DonDatTrangPhuc> updateDonDatTrangPhucTrangThai(
            @PathVariable Long id,
            @RequestParam String trangThai) {
        DonDatTrangPhuc updatedDonDatTrangPhuc = donDatTrangPhucService.updateDonDatTrangPhucTrangThai(id, trangThai);
        return ResponseEntity.ok(updatedDonDatTrangPhuc);
    }
}
