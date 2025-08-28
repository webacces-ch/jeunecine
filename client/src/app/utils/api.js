// API URL helper for SSR/CSR compatibility
export function getApiUrl(path = "") {
  // Use NEXT_PUBLIC_API_URL if defined, else fallback to the server URL
  const prodFallback = "https://leonardwicki.emf-informatique.ch";
  const devFallback = "http://localhost:8080";
  const base = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : (process.env.NODE_ENV === "development" ? devFallback : prodFallback);
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
}
