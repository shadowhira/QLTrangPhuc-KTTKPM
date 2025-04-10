package com.example.customerservice.service;

import com.example.customerservice.dto.TrangPhucDTO;
import com.example.customerservice.exception.ResourceNotFoundException;
import com.example.customerservice.model.TrangPhuc;
import com.example.customerservice.repository.TrangPhucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrangPhucService {

    private final TrangPhucRepository trangPhucRepository;

    @Autowired
    public TrangPhucService(TrangPhucRepository trangPhucRepository) {
        this.trangPhucRepository = trangPhucRepository;
    }

    public List<TrangPhucDTO> getAllTrangPhucs() {
        return trangPhucRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TrangPhucDTO getTrangPhucById(Long id) {
        TrangPhuc trangPhuc = trangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trang phục không tìm thấy với id: " + id));
        return convertToDTO(trangPhuc);
    }

    public List<TrangPhucDTO> getTrangPhucsByLoai(String loai) {
        return trangPhucRepository.findByLoai(loai).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TrangPhucDTO> getTrangPhucsByTrangThai(String trangThai) {
        return trangPhucRepository.findByTrangThai(trangThai).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TrangPhucDTO createTrangPhuc(TrangPhucDTO trangPhucDTO) {
        TrangPhuc trangPhuc = convertToEntity(trangPhucDTO);
        TrangPhuc savedTrangPhuc = trangPhucRepository.save(trangPhuc);
        return convertToDTO(savedTrangPhuc);
    }

    @Transactional
    public TrangPhucDTO updateTrangPhuc(Long id, TrangPhucDTO trangPhucDTO) {
        TrangPhuc existingTrangPhuc = trangPhucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trang phục không tìm thấy với id: " + id));

        existingTrangPhuc.setTen(trangPhucDTO.getTen());
        existingTrangPhuc.setLoai(trangPhucDTO.getLoai());
        existingTrangPhuc.setGiaThueNgay(trangPhucDTO.getGiaThueNgay());
        existingTrangPhuc.setGiaBan(trangPhucDTO.getGiaBan());
        existingTrangPhuc.setTrangThai(trangPhucDTO.getTrangThai());
        existingTrangPhuc.setMoTa(trangPhucDTO.getMoTa());

        TrangPhuc updatedTrangPhuc = trangPhucRepository.save(existingTrangPhuc);
        return convertToDTO(updatedTrangPhuc);
    }

    @Transactional
    public void deleteTrangPhuc(Long id) {
        if (!trangPhucRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trang phục không tìm thấy với id: " + id);
        }
        trangPhucRepository.deleteById(id);
    }

    // Helper methods to convert between Entity and DTO
    private TrangPhucDTO convertToDTO(TrangPhuc trangPhuc) {
        TrangPhucDTO dto = new TrangPhucDTO();
        dto.setId(trangPhuc.getId());
        dto.setTen(trangPhuc.getTen());
        dto.setLoai(trangPhuc.getLoai());
        dto.setGiaThueNgay(trangPhuc.getGiaThueNgay());
        dto.setGiaBan(trangPhuc.getGiaBan());
        dto.setTrangThai(trangPhuc.getTrangThai());
        dto.setMoTa(trangPhuc.getMoTa());
        return dto;
    }

    private TrangPhuc convertToEntity(TrangPhucDTO dto) {
        TrangPhuc trangPhuc = new TrangPhuc();
        trangPhuc.setTen(dto.getTen());
        trangPhuc.setLoai(dto.getLoai());
        trangPhuc.setGiaThueNgay(dto.getGiaThueNgay());
        trangPhuc.setGiaBan(dto.getGiaBan());
        trangPhuc.setTrangThai(dto.getTrangThai());
        trangPhuc.setMoTa(dto.getMoTa());
        return trangPhuc;
    }
}
