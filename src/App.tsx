import React, { useState, useEffect, useRef } from "react";
import { IssuesList } from "./components/IssuesList";
import { SearchWithAutoComplete } from "./components/SearchWithAutoComplete";
import { Message } from "./components/Message";
import { IssueType } from "./type";
import { searchIssuesOnGithub } from "./helper";
import "./App.css";

const App = () => {
  const [issues, setIssues] = useState<null | IssueType[]>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // This cache can be used when there's no search value, so we don't need to fetch again
  const issuesCache = useRef<null | IssueType[]>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/search/issues?q=repo:facebook/react"
        );
        const data = await response.json();

        if (data.items) {
          setIssues(data.items);
          issuesCache.current = data.items;
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (searchValue: string) => {
    // If there's no searchValue, simply render cached result
    if (searchValue.length === 0) {
      setIssues(issuesCache.current);
      return;
    }

    const results = await searchIssuesOnGithub(searchValue);
    if (results !== undefined) {
      setIssues(results);
    } else {
      setError(true);
    }
  };

  return (
    <section className="main-container">
      <h1>Search issues in React Repo</h1>
      <SearchWithAutoComplete handleSearch={handleSearch} />
      {loading && <Message text="Loading search results..." />}
      {!loading && error && (
        <Message text="Oops, we are having issues searching on Github" />
      )}
      <div className="issues-container">
        {!loading && issues && <IssuesList data={issues} />}
      </div>
    </section>
  );
};

export default App;
