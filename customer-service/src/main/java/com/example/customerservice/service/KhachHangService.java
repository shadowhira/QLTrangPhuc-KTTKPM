package com.example.customerservice.service;

import com.example.customerservice.exception.ResourceNotFoundException;
import com.example.customerservice.model.DiaChi;
import com.example.customerservice.model.KhachHang;
import com.example.customerservice.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;

    public KhachHangService(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    public List<KhachHang> getAllKhachHangs() {
        return khachHangRepository.findAll();
    }

    public KhachHang getKhachHangById(Long id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + id));
    }

    public List<KhachHang> getKhachHangsByTongChiTieu() {
        return khachHangRepository.findAllOrderByTongChiTieuDesc();
    }

    @Transactional
    public KhachHang createKhachHang(KhachHang khachHang) {
        if (khachHang.getTongChiTieu() == null) {
            khachHang.setTongChiTieu(0.0);
        }
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public KhachHang updateKhachHang(Long id, KhachHang khachHangUpdate) {
        KhachHang existingKhachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng không tìm thấy với id: " + id));

        // Update khachHang fields
        existingKhachHang.setHo(khachHangUpdate.getHo());
        existingKhachHang.setTen(khachHangUpdate.getTen());
        existingKhachHang.setSdt(khachHangUpdate.getSdt());
        existingKhachHang.setEmail(khachHangUpdate.getEmail());

        // Update address if provided
        if (khachHangUpdate.getDiaChi() != null) {
            DiaChi diaChi = existingKhachHang.getDiaChi();
            if (diaChi == null) {
                diaChi = new DiaChi();
                existingKhachHang.setDiaChi(diaChi);
            }
            diaChi.setThonXom(khachHangUpdate.getDiaChi().getThonXom());
            diaChi.setQuanHuyen(khachHangUpdate.getDiaChi().getQuanHuyen());
            diaChi.setTinhThanhPho(khachHangUpdate.getDiaChi().getTinhThanhPho());
        }

        return khachHangRepository.save(existingKhachHang);
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
}
