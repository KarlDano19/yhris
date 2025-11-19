import { useState, useEffect } from 'react';

interface UsePaginationProps {
  totalRecords: number;
  pageSize: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  pagination: {
    totalRecords: number;
    totalPages: number;
  };
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handlePageChange: (event: any) => void;
  handlePageSizeChange: (value: number) => void;
}

export const usePagination = ({
  totalRecords,
  pageSize: initialPageSize,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, totalRecords]);

  const handlePageChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const handlePageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  return {
    currentPage,
    pageSize,
    pagination: {
      totalRecords,
      totalPages,
    },
    setCurrentPage,
    setPageSize,
    handlePageChange,
    handlePageSizeChange,
  };
};

