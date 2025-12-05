import React from "react";
import "../Assets/CSS/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        ◀ Prev
      </button>

      <span className="pagination-info">
        Page <b>{currentPage}</b> / {totalPages}
      </span>

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;
