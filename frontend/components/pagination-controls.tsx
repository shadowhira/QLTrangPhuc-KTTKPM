"use client"

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  setCurrentPage,
  setPageSize
}) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-700">bản ghi mỗi trang</span>
        </div>

        <div className="text-sm text-gray-700">
          Hiển thị {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} đến {Math.min(currentPage * pageSize, totalItems)} trong tổng số {totalItems} bản ghi
        </div>
      </div>

      {totalItems > pageSize && (
        <div className="mt-2 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {(() => {
                // Hiển thị tối đa 5 trang, ưu tiên trang hiện tại ở giữa
                const visiblePages = [];
                
                if (totalPages <= 5) {
                  // Nếu tổng số trang <= 5, hiển thị tất cả
                  for (let i = 1; i <= totalPages; i++) {
                    visiblePages.push(i);
                  }
                } else {
                  // Luôn hiển thị trang đầu
                  visiblePages.push(1);
                  
                  // Tính toán phạm vi trang hiển thị xung quanh trang hiện tại
                  let startPage = Math.max(2, currentPage - 1);
                  let endPage = Math.min(totalPages - 1, startPage + 2);
                  
                  // Điều chỉnh nếu gần cuối
                  if (endPage === totalPages - 1) {
                    startPage = Math.max(2, endPage - 2);
                  }
                  
                  // Thêm dấu ... nếu cần
                  if (startPage > 2) {
                    visiblePages.push(-1); // -1 đại diện cho dấu ...
                  }
                  
                  // Thêm các trang ở giữa
                  for (let i = startPage; i <= endPage; i++) {
                    visiblePages.push(i);
                  }
                  
                  // Thêm dấu ... nếu cần
                  if (endPage < totalPages - 1) {
                    visiblePages.push(-2); // -2 đại diện cho dấu ... thứ hai
                  }
                  
                  // Luôn hiển thị trang cuối
                  visiblePages.push(totalPages);
                }
                
                return visiblePages.map(page => {
                  if (page < 0) {
                    // Hiển thị dấu ...
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
