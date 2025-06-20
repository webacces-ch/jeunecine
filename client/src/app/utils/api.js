// API URL helper for SSR/CSR compatibility
export function getApiUrl(path = "") {
  // En développement, utiliser localhost
  if (process.env.NODE_ENV === 'development') {
    const base = typeof window === "undefined" ? "http://localhost:3000" : "";
    return `${base}${path.startsWith("/") ? path : "/" + path}`;
  }
  
  // En production, utiliser l'URL définie ou le serveur distant
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL ||
        "https://leonardwicki.emf-informatique.ch"
      : process.env.NEXT_PUBLIC_API_URL ||
        "https://leonardwicki.emf-informatique.ch";
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
}
