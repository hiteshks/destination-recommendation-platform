import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./SearchFilters.css";

const getUniqueValues = (data = [], key) => {
  if (!Array.isArray(data)) return [];
  return [
    ...new Set(
      data.flatMap((item) => {
        const value = item[key];

        if (Array.isArray(value)) return value.map((v) => v.trim());
        if (typeof value === "string")
          return value.split(",").map((v) => v.trim());
        if (typeof value === "number") return [value];
        return [];
      })
    ),
  ].filter(Boolean);
};

const ratingOptions = [5, 4.5, 4, 3.5, 3];
const priceRangeOptions = [
  "0–5000",
  "5001–10000",
  "10001–20000",
  "20001–50000",
];

const SearchFilters = ({ onApplyFilters, onResetFilters, appliedFilters }) => {
  const allDestinations = useSelector(
    (state) => state.userData.allDestinations || []
  );

  const [expanded, setExpanded] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(appliedFilters || {});
  const [filtersApplied, setFiltersApplied] = useState(
    Object.keys(appliedFilters || {}).length > 0
  );
  const [loading, setLoading] = useState(false);

  const isFilterEmpty = Object.keys(selectedFilters).length === 0;

  const regionOptions = useMemo(
    () => getUniqueValues(allDestinations, "region"),
    [allDestinations]
  );
  const durationOptions = useMemo(
    () => getUniqueValues(allDestinations, "duration"),
    [allDestinations]
  );
  const seasonOptions = useMemo(
    () => getUniqueValues(allDestinations, "bestSeason"),
    [allDestinations]
  );
  const typeOptions = useMemo(
    () => getUniqueValues(allDestinations, "type"),
    [allDestinations]
  );

  const handleToggle = (key, value) => {
    setSelectedFilters((prev) => {
      const current = prev[key] || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => {
      onApplyFilters(selectedFilters);
      setFiltersApplied(true);
      setExpanded(false); // Collapse after applying
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setSelectedFilters({});
    onResetFilters();
    setFiltersApplied(false);
    setExpanded(false); // Collapse after resetting
  };

  const renderOptions = (key, options) => (
    <div className="filter-row">
      {options.map((option) => (
        <button
          key={option}
          className={`filter-option ${
            selectedFilters[key]?.includes(option) ? "selected" : ""
          }`}
          onClick={() => handleToggle(key, option)}
        >
          {option}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={`search-filters-container ${
        expanded ? "expanded" : "collapsed"
      }`}
    >
      <div className="filter-header">
        <h3 className="filter-title">
          Filters{" "}
          {filtersApplied && <span className="applied-tag">(Applied)</span>}
        </h3>
        <button
          className="dropdown-toggle-btn"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {expanded && (
        <>
          <div className="filter-group">
            <h4 className="filter-subtitle">Region</h4>
            {renderOptions("region", regionOptions)}
          </div>

          <div className="filter-group">
            <h4 className="filter-subtitle">Trip Duration</h4>
            {renderOptions("duration", durationOptions)}
          </div>

          <div className="filter-group">
            <h4 className="filter-subtitle">Best Season</h4>
            {renderOptions("bestSeason", seasonOptions)}
          </div>

          <div className="filter-group">
            <h4 className="filter-subtitle">Type</h4>
            {renderOptions("type", typeOptions)}
          </div>

          <div className="filter-group">
            <h4 className="filter-subtitle">Price Range</h4>
            {renderOptions("price", priceRangeOptions)}
          </div>

          <div className="filter-group">
            <h4 className="filter-subtitle">Rating</h4>
            {renderOptions("rating", ratingOptions)}
          </div>

          <div className="filter-actions">
            <button
              className="reset-btn"
              onClick={handleReset}
              disabled={loading || isFilterEmpty}
            >
              Reset
            </button>
            <button
              className="apply-btn"
              onClick={handleApply}
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply Filters"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchFilters;
