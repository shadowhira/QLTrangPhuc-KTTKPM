package com.example.customerservice.service;

import com.example.customerservice.dto.KhachHangDTO;
import com.example.customerservice.dto.DiaChiDTO;
import com.example.customerservice.exception.ResourceNotFoundException;
import com.example.customerservice.model.DiaChi;
import com.example.customerservice.model.KhachHang;
import com.example.customerservice.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;

    @Autowired
    public KhachHangService(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    public List<KhachHangDTO> getAllKhachHangs() {
        return khachHangRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public KhachHangDTO getKhachHangById(Long id) {
        KhachHang khachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + id));
        return convertToDTO(khachHang);
    }

    public List<KhachHangDTO> getKhachHangsByTongChiTieu() {
        return khachHangRepository.findAllOrderByTongChiTieuDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public KhachHangDTO createKhachHang(KhachHangDTO khachHangDTO) {
        KhachHang khachHang = convertToEntity(khachHangDTO);
        KhachHang savedKhachHang = khachHangRepository.save(khachHang);
        return convertToDTO(savedKhachHang);
    }

    @Transactional
    public KhachHangDTO updateKhachHang(Long id, KhachHangDTO khachHangDTO) {
        KhachHang existingKhachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + id));

        // Update khachHang fields
        existingKhachHang.setHo(khachHangDTO.getHo());
        existingKhachHang.setTen(khachHangDTO.getTen());
        existingKhachHang.setSdt(khachHangDTO.getSdt());
        existingKhachHang.setEmail(khachHangDTO.getEmail());

        // Update address if provided
        if (khachHangDTO.getDiaChi() != null) {
            DiaChi diaChi = existingKhachHang.getDiaChi();
            if (diaChi == null) {
                diaChi = new DiaChi();
                existingKhachHang.setDiaChi(diaChi);
            }
            diaChi.setThonXom(khachHangDTO.getDiaChi().getThonXom());
            diaChi.setQuanHuyen(khachHangDTO.getDiaChi().getQuanHuyen());
            diaChi.setTinhThanhPho(khachHangDTO.getDiaChi().getTinhThanhPho());
        }

        KhachHang updatedKhachHang = khachHangRepository.save(existingKhachHang);
        return convertToDTO(updatedKhachHang);
    }

    @Transactional
    public void deleteKhachHang(Long id) {
        if (!khachHangRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + id);
        }
        khachHangRepository.deleteById(id);
    }

    @Transactional
    public void updateKhachHangTongChiTieu(Long khachHangId, Double amount) {
        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + khachHangId));

        khachHang.setTongChiTieu(khachHang.getTongChiTieu() + amount);
        khachHangRepository.save(khachHang);
    }

    // Helper methods to convert between Entity and DTO
    private KhachHangDTO convertToDTO(KhachHang khachHang) {
        KhachHangDTO dto = new KhachHangDTO();
        dto.setId(khachHang.getId());
        dto.setHo(khachHang.getHo());
        dto.setTen(khachHang.getTen());
        dto.setSdt(khachHang.getSdt());
        dto.setEmail(khachHang.getEmail());
        dto.setTongChiTieu(khachHang.getTongChiTieu());

        if (khachHang.getDiaChi() != null) {
            DiaChiDTO diaChiDTO = new DiaChiDTO();
            diaChiDTO.setId(khachHang.getDiaChi().getId());
            diaChiDTO.setThonXom(khachHang.getDiaChi().getThonXom());
            diaChiDTO.setQuanHuyen(khachHang.getDiaChi().getQuanHuyen());
            diaChiDTO.setTinhThanhPho(khachHang.getDiaChi().getTinhThanhPho());
            dto.setDiaChi(diaChiDTO);
        }

        return dto;
    }

    private KhachHang convertToEntity(KhachHangDTO dto) {
        KhachHang khachHang = new KhachHang();
        khachHang.setHo(dto.getHo());
        khachHang.setTen(dto.getTen());
        khachHang.setSdt(dto.getSdt());
        khachHang.setEmail(dto.getEmail());
        khachHang.setTongChiTieu(dto.getTongChiTieu() != null ? dto.getTongChiTieu() : 0.0);

        if (dto.getDiaChi() != null) {
            DiaChi diaChi = new DiaChi();
            diaChi.setThonXom(dto.getDiaChi().getThonXom());
            diaChi.setQuanHuyen(dto.getDiaChi().getQuanHuyen());
            diaChi.setTinhThanhPho(dto.getDiaChi().getTinhThanhPho());
            khachHang.setDiaChi(diaChi);
        }

        return khachHang;
    }
}
