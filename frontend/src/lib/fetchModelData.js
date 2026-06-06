const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8081")
  .replace(/\/$/, "");

function fetchModel(url, options = {}) {
  const requestUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${API_BASE}${url}`;

  const defaultOptions = {
    credentials: "include",
    ...options,
  };

  return fetch(requestUrl, defaultOptions).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text || response.statusText || String(response.status));
      });
    }
    return response.json();
  });
}

export default fetchModel;
