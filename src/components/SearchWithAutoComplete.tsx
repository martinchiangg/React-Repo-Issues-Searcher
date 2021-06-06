import React, { useEffect, useState, useRef } from "react";
import { IssueType } from "../type";
import { searchIssuesOnGithub } from "../helper";
import "./SearchWithAutoComplete.css";

export const SearchWithAutoComplete = ({
  handleSearch,
}: {
  handleSearch: (searchValue: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<IssueType[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceInputTimer = useRef<number>(0);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // If the input has no focus, we don't need to worry about fetching suggestions nor showing search options
    if (document.activeElement !== inputRef.current) return;

    if (searchValue.length === 0) {
      // Passing empty string to `handleSearch` results in rendering cached issues
      handleSearch("");
      setShowAutoComplete(false);
      return;
    }

    const searchIssues = async () => {
      setShowAutoComplete(false);

      const issues = await searchIssuesOnGithub(searchValue);

      if (issues !== undefined) {
        setOptions(issues);
      } else {
        setError(true);
      }

      setShowAutoComplete(true);
    };

    // Github has 10 request/min cap for unauthorized client, so we debounce here to reduce the likelyhood of 403s
    if (debounceInputTimer.current) {
      clearTimeout(debounceInputTimer.current);
    }

    debounceInputTimer.current = window.setTimeout(() => {
      searchIssues();
    }, 1000);
  }, [searchValue]);

  function handleClickOutside(e: any) {
    // @ts-ignore
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowAutoComplete(false);
    }
  }

  const handleEnterOrSearchClick = (title?: string) => {
    setActiveIndex(0);
    setShowAutoComplete(false);

    if (options[activeIndex] && options[activeIndex].title) {
      setSearchValue(options[activeIndex].title);
      handleSearch(options[activeIndex].title);
    } else if (title !== undefined) {
      setSearchValue(title);
      handleSearch(title);
    } else {
      handleSearch(searchValue);
    }

    if (inputRef.current) inputRef.current.blur();
  };

  const handleNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (options === null) return;

    if (e.key === "Enter") {
      handleEnterOrSearchClick();
    } else if (e.key === "ArrowUp" && activeIndex !== 0) {
      setActiveIndex(activeIndex - 1);
    } else if (e.key === "ArrowDown" && activeIndex - 1 !== options.length) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div className="search-container">
      <div className="auto-complete-container" ref={wrapperRef}>
        <input
          className="search-input"
          placeholder="Type to search"
          autoComplete="off"
          value={searchValue}
          ref={inputRef}
          onClick={() => setShowAutoComplete(!showAutoComplete)}
          onChange={(event) => setSearchValue(event.target.value)}
          onKeyDown={handleNavigation}
        />
        {showAutoComplete && (
          <div className="auto-complete">
            {!options && searchValue && <li>{`Search for ${searchValue}`}</li>}
            {error && (
              <li>
                Sorry, there's an issue fetching suggestions from Guthub. Please
                try later.
              </li>
            )}
            {searchValue.length > 0 && options.length === 0 && (
              <div className="option">
                <span>No suggestions available for you input</span>
              </div>
            )}
            {options.length > 0 &&
              options.map((issue, index) => (
                <div
                  onClick={() => handleEnterOrSearchClick(issue.title)}
                  className={`option ${activeIndex === index ? "active" : ""}`}
                  key={index}
                  tabIndex={0}
                >
                  <span>{issue.title}</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <button className="search-btn" onClick={() => handleEnterOrSearchClick}>
        Search
      </button>
    </div>
  );
};
