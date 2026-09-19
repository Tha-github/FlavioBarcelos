import { useEffect, useRef } from 'preact/hooks';
import type { FotoGaleriaOtimizada } from './galeria-tipos';

interface Props {
  fotos: FotoGaleriaOtimizada[];
  indice: number;
  onIr: (indice: number) => void;
  onFechar: () => void;
}

const botao =
  'flex h-11 w-11 items-center justify-center rounded-full border border-champagne bg-onyx text-pearl hover:bg-velvet cursor-pointer';

function Imagem({ foto, eager }: { foto: FotoGaleriaOtimizada; eager?: boolean }) {
  return (
    <picture>
      <source type="image/avif" srcset={foto.full.avif} />
      <source type="image/webp" srcset={foto.full.webp} />
      <img
        src={foto.full.src}
        alt={foto.alt}
        width={foto.full.largura}
        height={foto.full.altura}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        draggable={false}
        class="max-h-[72dvh] w-auto max-w-full object-contain"
      />
    </picture>
  );
}

export default function Lightbox({ fotos, indice, onIr, onFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const toqueX = useRef<number | null>(null);
  const total = fotos.length;
  const foto = fotos[indice]!;
  const anterior = (indice - 1 + total) % total;
  const proxima = (indice + 1) % total;

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    if (!el.open) el.showModal();
    // Bloqueia a rolagem da página enquanto aberto.
    const overflowAnterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = overflowAnterior;
    };
  }, []);

  const ir = (delta: number) => onIr((indice + delta + total) % total);

  return (
    <dialog
      ref={dialogo}
      aria-label="Galeria de fotos ampliada"
      class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col items-center justify-center bg-onyx/95 p-0 text-pearl open:flex"
      onClose={onFechar}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          ir(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          ir(1);
        }
      }}
    >
      <div class="tema-escuro flex w-full max-w-[1240px] items-center justify-between px-4 py-3">
        <p role="status" aria-live="polite" class="text-step--1">
          {indice + 1} de {total}
        </p>
        <button
          type="button"
          class={botao}
          aria-label="Fechar"
          onClick={() => dialogo.current?.close()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <div class="tema-escuro flex min-h-0 w-full flex-1 items-center justify-center gap-2 px-2 sm:gap-6 sm:px-6">
        <button
          type="button"
          class={`${botao} shrink-0 max-sm:absolute max-sm:top-1/2 max-sm:left-2 max-sm:z-10`}
          aria-label="Foto anterior"
          onClick={() => ir(-1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div
          class="flex min-w-0 touch-pan-y justify-center"
          onTouchStart={(e) => {
            toqueX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const inicio = toqueX.current;
            toqueX.current = null;
            const fim = e.changedTouches[0]?.clientX;
            if (inicio === null || fim === undefined) return;
            if (Math.abs(fim - inicio) > 50) ir(fim < inicio ? 1 : -1);
          }}
        >
          <Imagem foto={foto} eager />
        </div>
        <button
          type="button"
          class={`${botao} shrink-0 max-sm:absolute max-sm:top-1/2 max-sm:right-2 max-sm:z-10`}
          aria-label="Próxima foto"
          onClick={() => ir(1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="h-6" aria-hidden="true" />

      {/* Pré-carrega só a anterior e a próxima. */}
      {total > 1 && (
        <div hidden aria-hidden="true">
          <Imagem foto={fotos[anterior]!} eager />
          {proxima !== anterior && <Imagem foto={fotos[proxima]!} eager />}
        </div>
      )}
    </dialog>
  );
}
