import React from "react";
import "../Assets/CSS/SortBar.css";

const SortBar = ({ sort, onSortChange }) => {
  return (
    <div className="sortbar-container">
      <label className="sortbar-label">Sort by:</label>

      <select
        className="sortbar-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>
    </div>
  );
};

export default SortBar;
