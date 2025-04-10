package com.example.customerservice.controller;

import com.example.customerservice.dto.TrangPhucDTO;
import com.example.customerservice.service.TrangPhucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trang-phuc")
public class TrangPhucController {

    private final TrangPhucService trangPhucService;

    @Autowired
    public TrangPhucController(TrangPhucService trangPhucService) {
        this.trangPhucService = trangPhucService;
    }

    @GetMapping
    public ResponseEntity<List<TrangPhucDTO>> getAllTrangPhucs() {
        List<TrangPhucDTO> trangPhucs = trangPhucService.getAllTrangPhucs();
        return ResponseEntity.ok(trangPhucs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrangPhucDTO> getTrangPhucById(@PathVariable Long id) {
        TrangPhucDTO trangPhuc = trangPhucService.getTrangPhucById(id);
        return ResponseEntity.ok(trangPhuc);
    }

    @GetMapping("/loai/{loai}")
    public ResponseEntity<List<TrangPhucDTO>> getTrangPhucsByLoai(@PathVariable String loai) {
        List<TrangPhucDTO> trangPhucs = trangPhucService.getTrangPhucsByLoai(loai);
        return ResponseEntity.ok(trangPhucs);
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<List<TrangPhucDTO>> getTrangPhucsByTrangThai(@PathVariable String trangThai) {
        List<TrangPhucDTO> trangPhucs = trangPhucService.getTrangPhucsByTrangThai(trangThai);
        return ResponseEntity.ok(trangPhucs);
    }

    @PostMapping
    public ResponseEntity<TrangPhucDTO> createTrangPhuc(@RequestBody TrangPhucDTO trangPhucDTO) {
        TrangPhucDTO createdTrangPhuc = trangPhucService.createTrangPhuc(trangPhucDTO);
        return new ResponseEntity<>(createdTrangPhuc, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrangPhucDTO> updateTrangPhuc(@PathVariable Long id, @RequestBody TrangPhucDTO trangPhucDTO) {
        TrangPhucDTO updatedTrangPhuc = trangPhucService.updateTrangPhuc(id, trangPhucDTO);
        return ResponseEntity.ok(updatedTrangPhuc);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrangPhuc(@PathVariable Long id) {
        trangPhucService.deleteTrangPhuc(id);
        return ResponseEntity.noContent().build();
    }
}
