let apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

// If the URL doesn't start with http, assume it's a domain and prepend https://
if (!apiUrl.startsWith("http")) {
  apiUrl = `https://${apiUrl}`;
}

// Remove trailing slash if present to avoid double slashes
if (apiUrl.endsWith("/")) {
  apiUrl = apiUrl.slice(0, -1);
}

export const API_URL = apiUrl;