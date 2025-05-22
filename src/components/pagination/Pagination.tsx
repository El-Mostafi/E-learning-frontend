import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container flex justify-center my-8">
      <nav aria-label="Pagination">
        <ul className="flex flex-wrap items-center gap-1 md:gap-2">
          {/* Previous button */}
          <li>
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-800 border border-gray-300'
              }`}
              aria-label="Go to previous page"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {/* Page numbers */}
          {getPageNumbers().map((pageNumber) => (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-700 hover:text-blue-600 border border-gray-300'
                }`}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            </li>
          ))}

          {/* Next button */}
          <li>
            <button
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-800 border border-gray-300'
              }`}
              aria-label="Go to next page"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;