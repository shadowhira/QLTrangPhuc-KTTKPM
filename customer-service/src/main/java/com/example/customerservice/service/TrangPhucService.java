package com.example.customerservice.service;

import com.example.customerservice.exception.ResourceNotFoundException;
import com.example.customerservice.model.TrangPhuc;
import com.example.customerservice.repository.TrangPhucRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrangPhucService {

    private final TrangPhucRepository trangPhucRepository;

    public TrangPhucService(TrangPhucRepository trangPhucRepository) {
        this.trangPhucRepository = trangPhucRepository;
    }

    public List<TrangPhuc> getAllTrangPhucs() {
        return trangPhucRepository.findAll();
    }

    public TrangPhuc getTrangPhucById(Long id) {
        return trangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trang phục không tìm thấy với id: " + id));
    }

    public List<TrangPhuc> getTrangPhucsByLoai(String loai) {
        return trangPhucRepository.findByLoai(loai);
    }

    public List<TrangPhuc> getTrangPhucsByTrangThai(String trangThai) {
        return trangPhucRepository.findByTrangThai(trangThai);
    }

    @Transactional
    public TrangPhuc createTrangPhuc(TrangPhuc trangPhuc) {
        return trangPhucRepository.save(trangPhuc);
    }

    @Transactional
    public TrangPhuc updateTrangPhuc(Long id, TrangPhuc trangPhucUpdate) {
        TrangPhuc existingTrangPhuc = trangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trang phục không tìm thấy với id: " + id));

        existingTrangPhuc.setTen(trangPhucUpdate.getTen());
        existingTrangPhuc.setLoai(trangPhucUpdate.getLoai());
        existingTrangPhuc.setGiaThueNgay(trangPhucUpdate.getGiaThueNgay());
        existingTrangPhuc.setGiaBan(trangPhucUpdate.getGiaBan());
        existingTrangPhuc.setTrangThai(trangPhucUpdate.getTrangThai());
        existingTrangPhuc.setMoTa(trangPhucUpdate.getMoTa());

        return trangPhucRepository.save(existingTrangPhuc);
    }

    @Transactional
    public void deleteTrangPhuc(Long id) {
        if (!trangPhucRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trang phục không tìm thấy với id: " + id);
        }
        trangPhucRepository.deleteById(id);
    }
}
