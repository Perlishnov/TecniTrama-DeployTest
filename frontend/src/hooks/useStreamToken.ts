import { useMemo } from "react";

export const useStreamToken = (providedToken?: string) => {
  const streamToken = providedToken || localStorage.getItem("streamToken") || "";

  // Verifica si no hay token y lanza un error o retorna un valor adecuado
  if (!streamToken) {
    console.error("Token de Stream no encontrado");
    return null; // O podrías retornar un string vacío o algo que indique el error
  }

  return useMemo(() => streamToken, [streamToken]);
};
