package com.example.customerservice.controller;

import com.example.customerservice.dto.KhachHangDTO;
import com.example.customerservice.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangController {

    private final KhachHangService khachHangService;

    @Autowired
    public KhachHangController(KhachHangService khachHangService) {
        this.khachHangService = khachHangService;
    }

    @GetMapping
    public ResponseEntity<List<KhachHangDTO>> getAllKhachHangs() {
        List<KhachHangDTO> khachHangs = khachHangService.getAllKhachHangs();
        return ResponseEntity.ok(khachHangs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHangDTO> getKhachHangById(@PathVariable Long id) {
        KhachHangDTO khachHang = khachHangService.getKhachHangById(id);
        return ResponseEntity.ok(khachHang);
    }

    @GetMapping("/theo-chi-tieu")
    public ResponseEntity<List<KhachHangDTO>> getKhachHangsByTongChiTieu() {
        List<KhachHangDTO> khachHangs = khachHangService.getKhachHangsByTongChiTieu();
        return ResponseEntity.ok(khachHangs);
    }

    @PostMapping
    public ResponseEntity<KhachHangDTO> createKhachHang(@RequestBody KhachHangDTO khachHangDTO) {
        KhachHangDTO createdKhachHang = khachHangService.createKhachHang(khachHangDTO);
        return new ResponseEntity<>(createdKhachHang, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHangDTO> updateKhachHang(@PathVariable Long id, @RequestBody KhachHangDTO khachHangDTO) {
        KhachHangDTO updatedKhachHang = khachHangService.updateKhachHang(id, khachHangDTO);
        return ResponseEntity.ok(updatedKhachHang);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKhachHang(@PathVariable Long id) {
        khachHangService.deleteKhachHang(id);
        return ResponseEntity.noContent().build();
    }
}
