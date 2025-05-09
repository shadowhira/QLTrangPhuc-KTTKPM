package com.example.customerservice.controller;

import com.example.customerservice.model.TrangPhuc;
import com.example.customerservice.service.TrangPhucService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trang-phuc")
public class TrangPhucController {

    private final TrangPhucService trangPhucService;

    public TrangPhucController(TrangPhucService trangPhucService) {
        this.trangPhucService = trangPhucService;
    }

    @GetMapping
    public ResponseEntity<List<TrangPhuc>> getAllTrangPhucs() {
        List<TrangPhuc> trangPhucs = trangPhucService.getAllTrangPhucs();
        return ResponseEntity.ok(trangPhucs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrangPhuc> getTrangPhucById(@PathVariable Long id) {
        TrangPhuc trangPhuc = trangPhucService.getTrangPhucById(id);
        return ResponseEntity.ok(trangPhuc);
    }

    @GetMapping("/loai/{loai}")
    public ResponseEntity<List<TrangPhuc>> getTrangPhucsByLoai(@PathVariable String loai) {
        List<TrangPhuc> trangPhucs = trangPhucService.getTrangPhucsByLoai(loai);
        return ResponseEntity.ok(trangPhucs);
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<List<TrangPhuc>> getTrangPhucsByTrangThai(@PathVariable String trangThai) {
        List<TrangPhuc> trangPhucs = trangPhucService.getTrangPhucsByTrangThai(trangThai);
        return ResponseEntity.ok(trangPhucs);
    }

    @PostMapping
    public ResponseEntity<TrangPhuc> createTrangPhuc(@RequestBody TrangPhuc trangPhuc) {
        TrangPhuc createdTrangPhuc = trangPhucService.createTrangPhuc(trangPhuc);
        return new ResponseEntity<>(createdTrangPhuc, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrangPhuc> updateTrangPhuc(@PathVariable Long id, @RequestBody TrangPhuc trangPhuc) {
        TrangPhuc updatedTrangPhuc = trangPhucService.updateTrangPhuc(id, trangPhuc);
        return ResponseEntity.ok(updatedTrangPhuc);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrangPhuc(@PathVariable Long id) {
        trangPhucService.deleteTrangPhuc(id);
        return ResponseEntity.noContent().build();
    }
}
