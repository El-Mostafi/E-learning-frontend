import React from "react";

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
  

  return (
    <div className="page-nav-wrap pt-5 text-center">
      <ul className="inline-flex gap-2 justify-center items-center">
        {currentPage > 1 && (
          <li>
            <a
              title="Previous"
              className="page-numbers"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
            >
              <i className="far fa-arrow-left"></i>
            </a>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((pageNum) => {
            return (
              pageNum <= 2 || // first 2
              pageNum > totalPages - 2 || // last 2
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) // around current
            );
          })
          .reduce((acc, pageNum, idx, arr) => {
            if (idx > 0 && pageNum - arr[idx - 1] > 1) {
              acc.push("...");
            }
            acc.push(pageNum);
            return acc;
          }, [] as (number | string)[])
          .map((item, index) => (
            <li key={index}>
              {item === "..." ? (
                <span className="page-numbers dots">...</span>
              ) : (
                <a
                  className={`page-numbers ${
                    item === currentPage ? "current" : ""
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (typeof item === "number") {
                      onPageChange(item);
                    }
                  }}
                >
                  {item}
                </a>
              )}
            </li>
          ))}

        {currentPage < totalPages && (
          <li>
            <a
              title="Next"
              className="page-numbers"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
            >
              <i className="far fa-arrow-right"></i>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
