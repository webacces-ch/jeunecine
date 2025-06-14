// API URL helper for SSR/CSR compatibility
export function getApiUrl(path = "") {
  // Use NEXT_PUBLIC_API_URL if defined, else fallback to the server URL
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL ||
        "https://leonardwicki.emf-informatique.ch"
      : process.env.NEXT_PUBLIC_API_URL ||
        "https://leonardwicki.emf-informatique.ch";
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
}
