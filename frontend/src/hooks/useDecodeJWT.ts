import { useMemo } from "react";

export const useDecodeJWT = (providedToken?: string) => {
  // Usa el token proporcionado o, si no, lo obtiene de localStorage
  const token = providedToken || localStorage.getItem("token") || "";

  return useMemo(() => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }, [token]);
};
