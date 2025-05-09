package com.example.customerservice.controller;

import com.example.customerservice.model.KhachHang;
import com.example.customerservice.service.KhachHangService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangController {

    private final KhachHangService khachHangService;

    public KhachHangController(KhachHangService khachHangService) {
        this.khachHangService = khachHangService;
    }

    @GetMapping
    public ResponseEntity<List<KhachHang>> getAllKhachHangs() {
        List<KhachHang> khachHangs = khachHangService.getAllKhachHangs();
        return ResponseEntity.ok(khachHangs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHang> getKhachHangById(@PathVariable Long id) {
        KhachHang khachHang = khachHangService.getKhachHangById(id);
        return ResponseEntity.ok(khachHang);
    }

    @GetMapping("/theo-chi-tieu")
    public ResponseEntity<List<KhachHang>> getKhachHangsByTongChiTieu() {
        List<KhachHang> khachHangs = khachHangService.getKhachHangsByTongChiTieu();
        return ResponseEntity.ok(khachHangs);
    }

    @PostMapping
    public ResponseEntity<KhachHang> createKhachHang(@RequestBody KhachHang khachHang) {
        KhachHang createdKhachHang = khachHangService.createKhachHang(khachHang);
        return new ResponseEntity<>(createdKhachHang, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHang> updateKhachHang(@PathVariable Long id, @RequestBody KhachHang khachHang) {
        KhachHang updatedKhachHang = khachHangService.updateKhachHang(id, khachHang);
        return ResponseEntity.ok(updatedKhachHang);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKhachHang(@PathVariable Long id) {
        khachHangService.deleteKhachHang(id);
        return ResponseEntity.noContent().build();
    }
}
