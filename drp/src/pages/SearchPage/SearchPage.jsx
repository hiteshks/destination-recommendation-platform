import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import fuzzyMatch from "../../utils/fuzzyMatch";
import SearchResultCard from "./SearchResultCard";
import SearchFilters from "./SearchFilters";
import "./SearchPage.css";

const filterMatches = (destination, filters) => {
  for (const key in filters) {
    const selected = filters[key];
    if (!selected?.length) continue;

    if (key === "rating") {
      const rating = parseFloat(destination.rating) || 0;
      const match = selected.some((val) => rating >= val);
      if (!match) return false;
    } else if (key === "price") {
      const price = destination.price || 0;
      const match = selected.some((range) => {
        const [min, max] = range.split("–").map(Number);
        return price >= min && price <= max;
      });
      if (!match) return false;
    } else {
      const destVal = Array.isArray(destination[key])
        ? destination[key]
        : [destination[key]];
      const match = selected.some((val) => destVal.includes(val));
      if (!match) return false;
    }
  }

  return true;
};

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [results, setResults] = useState([]);
  const { allDestinations } = useSelector((state) => state.userData);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (!allDestinations.length) return;

    const matched = allDestinations.filter((dest) => fuzzyMatch(dest, query));
    setResults(matched);
  }, [query, allDestinations]);

  const handleApplyFilters = (filters) => {
    setLoading(true);
    setSelectedFilters(filters);

    setTimeout(() => {
      const filtered = allDestinations
        .filter((dest) => fuzzyMatch(dest, query))
        .filter((dest) => filterMatches(dest, filters));

      setResults(filtered);
      setLoading(false);
    }, 700);
  };

  const handleResetFilters = () => {
    setSelectedFilters({});
    const matched = allDestinations.filter((dest) => fuzzyMatch(dest, query));
    setResults(matched);
  };

  return (
    <div className="search-page">
      <SearchFilters
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        appliedFilters={selectedFilters}
      />

      {loading ? (
        <p className="search-loading">Loading results...</p>
      ) : !results.length ? (
        <p>No results found for "{query}".</p>
      ) : (
        <div className="search-results">
          {results.map((dest) => (
            <SearchResultCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
