export const searchIssuesOnGithub = async (searchValue: string) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/issues?q=repo:facebook/react+${searchValue}%20in:title`
    );
    const data = await response.json();
    return data.items;
  } catch (e) {
    return undefined;
  }
};
