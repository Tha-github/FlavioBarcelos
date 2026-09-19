/** Foto da galeria já otimizada no servidor (srcset gerado pelo astro:assets). */
export interface FotoGaleriaOtimizada {
  id: string;
  alt: string;
  thumb: { avif: string; webp: string; src: string; largura: number; altura: number };
  full: { avif: string; webp: string; src: string; largura: number; altura: number };
}

export interface ReelOtimizado {
  id: string;
  titulo: string;
  video: string;
  poster: string;
  posterLargura: number;
  posterAltura: number;
  legendas: string | null;
}
