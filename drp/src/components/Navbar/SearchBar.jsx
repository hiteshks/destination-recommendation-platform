import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./Navbar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // ✅ Load initial query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [location.search]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const isActive = isFocused || query.length > 0;

  return (
    <div className={`navbar-search ${isActive ? "active" : ""}`}>
      <input
        type="text"
        placeholder="Search destinations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSearch}>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
