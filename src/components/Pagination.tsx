/* eslint-disable prefer-const */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  // Logic to generate page numbers for display (e.g., [1, '...', 4, 5, 6, '...', 10])
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage > 3) {
        pageNumbers.push(ellipsis);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(ellipsis);
      }

      pageNumbers.push(totalPages);
    }
    return Array.from(new Set(pageNumbers));
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-8">
      <nav className="flex items-center space-x-2" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-3 h-9 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers - Hidden on small screens */}
        <div className="hidden sm:flex items-center space-x-2">
          {pageNumbers.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={`${page}-${index}`}
                onClick={() => onPageChange(page)}
                className={`flex items-center justify-center w-9 h-9 text-sm font-medium border rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-pink-600 border-pink-600 text-white cursor-default"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ) : (
              <span
                key={`${page}-${index}`}
                className="px-2 h-9 flex items-center text-gray-500"
              >
                {page}
              </span>
            )
          )}
        </div>

        {/* Current Page Info - Only on small screens */}
        <div className="sm:hidden text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-3 h-9 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
