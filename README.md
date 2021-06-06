# Github React Repo Issues Searcher

## Installation & Usage

Install dependencies:

```
npm install
```

Create build:

```
npm run build
```

Development mode with HMR:

```
npm run dev
```

The browser will open a tab which takes you to [localhost:4000](http://localhost:4000/).

Open App in browser:

```
npm run build
```

And open `index.html` with your browser.

## Overview

1. This app does not use statement management tools such as React context API or Redux, as passing props one layer down solves what we need.

2. Make `SearchWithAutoComplete` and `IssuesList` functional components so they could be re-used in other parts of the app.

3. The source of auto complete suggestions, is making a GET request to same Github API that looks for a match in issues' titles. This behavior is debounced to be invoked every second to avoid excessive request. (Github has 10 request/min cap for unauthorized client, so we debounce reduce the likelyhood of 403s).

4. Customized Webpack reduces bundle size (create-react-app has many built-in dependencies that we don't need). Configured with Typescript. I love Typescript!

5. Consider the time suggested working on this assignment, there is no unit or e2e tests. There are detailed steps below to test if the app is working as expected.

6. Since this is a solution-first assignment, the app has very simple styling.

## Checklist

- [x] Have a homepage that shows a list of 20 most recent issues in React's repository. Each list item contains issue's title and its label(s).

- [x] Allow users to click into each issue, and open a separate window that has detailed info.

- [x] User should see an input field that has autocomplete feature. Autocomplete should be navagable with keyboard. Pressing Enter should search Github and re-render the list.

- [x] Error handling: handle user experience when things go wrong.

## Test Steps

1. Open `index.html` with your browser. User should first see a `Loading...`, followed by an ordered list of different issues.

2. Click on a random issue, user should see a new browser window, which takes the user to corresponding issue..

3. When user start typing in the input, there should be auto suggestion options showing up after 1 second. The suggestions should be navigable with keyboard `ArrowUp` and `ArrowDown`.

4. When auto suggestions are visible, clicking outside of the it should close the suggestions dropdown.

5. Mouse Click or pressing keyboard "Enter" on suggestions should trigger a fetch to get issues that their `title` matches with the search input.

6. Deleteing search input should immediately triggers a re-render, which shows the user cached issues so no redundant GET request would be made.

7. Error handling: When there is no result for given search input (such as `"dddd"`), user should see `"Can't find any result on Github. Try to search for something else..."`

8. When searching operations exceeds Github's limit (10 request/min), user should see `"Sorry, there's an issue fetching suggestions from Guthub. Please try later."` in the suggestions. This could be invoked by typing `"abcdefghij"` at a one-character-per-second interval.
