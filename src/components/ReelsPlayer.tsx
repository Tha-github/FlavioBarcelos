import { useEffect, useRef, useState } from 'preact/hooks';
import type { ReelOtimizado } from './galeria-tipos';

const seta =
  'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-velvet bg-silk text-velvet hover:bg-velvet hover:text-silk disabled:cursor-default disabled:opacity-40 disabled:hover:bg-silk disabled:hover:text-velvet';
const botaoVideo =
  'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-champagne bg-onyx text-pearl hover:bg-velvet';

export default function ReelsPlayer({ reels }: { reels: ReelOtimizado[] }) {
  const total = reels.length;
  const [indice, setIndice] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [mudo, setMudo] = useState(true);
  const [erro, setErro] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const interagiu = useRef(false);
  const retomar = useRef(false);
  const toqueX = useRef<number | null>(null);
  const atual = reels[indice]!;

  // O mp4 só é solicitado ao clicar em reproduzir: o src é atribuído nesse momento.
  const tocar = async () => {
    const el = video.current;
    if (!el) return;
    if (el.getAttribute('src') !== atual.video) el.setAttribute('src', atual.video);
    try {
      await el.play();
    } catch {
      setErro(true);
    }
  };
  const alternar = () => {
    const el = video.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    setErro(false);
    void tocar();
  };
  const ir = (destino: number) => {
    const alvo = Math.min(total - 1, Math.max(0, destino));
    if (alvo === indice) return;
    const el = video.current;
    // Se estava tocando, o próximo começa a tocar; senão, mostra o poster.
    retomar.current = !!el && !el.paused;
    if (el) {
      el.pause();
      el.removeAttribute('src');
      el.load();
    }
    setErro(false);
    setIndice(alvo);
  };

  useEffect(() => {
    if (retomar.current) {
      retomar.current = false;
      void tocar();
    }
    // Pré-carrega só o poster do próximo e do anterior.
    for (const j of [indice - 1, indice + 1]) {
      const vizinho = reels[j];
      if (vizinho) new Image().src = vizinho.poster;
    }
  }, [indice]);

  // Se a seta focada ficar desabilitada (ponta), o foco volta para a região.
  useEffect(() => {
    if (!interagiu.current) return;
    interagiu.current = false;
    const id = setTimeout(() => {
      const ativo = document.activeElement;
      if (
        raiz.current &&
        (ativo === document.body || (ativo instanceof HTMLButtonElement && ativo.disabled))
      ) {
        raiz.current.focus();
      }
    }, 0);
    return () => clearTimeout(id);
  }, [indice]);

  useEffect(() => {
    // Pausa ao sair da viewport.
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada && !entrada.isIntersecting && video.current && !video.current.paused) {
        video.current.pause();
      }
    });
    if (raiz.current) observador.observe(raiz.current);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={raiz}
      tabIndex={-1}
      style={{ outline: 'none' }}
      onClickCapture={() => {
        interagiu.current = true;
      }}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Reels do studio"
      onKeyDown={(e) => {
        interagiu.current = true;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          ir(indice - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          ir(indice + 1);
        }
      }}
    >
      <div
        class="relative mx-auto aspect-[9/16] w-[min(360px,45svh,calc(100vw-2.5rem))] touch-pan-y bg-onyx"
        onTouchStart={(e) => {
          toqueX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const inicio = toqueX.current;
          toqueX.current = null;
          const fim = e.changedTouches[0]?.clientX;
          if (inicio === null || fim === undefined || Math.abs(fim - inicio) < 50) return;
          ir(fim < inicio ? indice + 1 : indice - 1);
        }}
      >
        <video
          ref={video}
          class="h-full w-full object-cover"
          preload="none"
          playsInline
          muted={mudo}
          loop
          poster={atual.poster}
          width={atual.posterLargura}
          height={atual.posterAltura}
          aria-label={atual.titulo}
          onPlay={() => setTocando(true)}
          onPause={() => setTocando(false)}
          onError={() => setErro(true)}
        >
          {atual.legendas && (
            <track
              key={atual.legendas}
              kind="captions"
              srcLang="pt-BR"
              label="Português"
              src={atual.legendas}
              default
            />
          )}
        </video>

        <button
          type="button"
          class="absolute inset-0 flex cursor-pointer items-center justify-center"
          aria-label={`${tocando ? 'Pausar' : 'Reproduzir'} vídeo: ${atual.titulo}`}
          onClick={alternar}
        >
          {!tocando && (
            <span class="flex h-14 w-14 items-center justify-center rounded-full border border-champagne bg-onyx/80 text-pearl">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
        </button>

        <button
          type="button"
          class={`${botaoVideo} absolute top-3 right-3 z-10`}
          aria-label={`${mudo ? 'Ativar' : 'Desativar'} som: ${atual.titulo}`}
          onClick={() => {
            const novo = !mudo;
            if (video.current) video.current.muted = novo;
            setMudo(novo);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            {mudo ? (
              <path
                d="M17 9l5 6M22 9l-5 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            ) : (
              <path
                d="M17 8c1.5 1.2 1.5 6.8 0 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            )}
          </svg>
        </button>

        <button
          type="button"
          class={`${seta} left-2 sm:-left-16`}
          aria-label="Vídeo anterior"
          disabled={indice === 0}
          onClick={() => ir(indice - 1)}
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
        <button
          type="button"
          class={`${seta} right-2 sm:-right-16`}
          aria-label="Próximo vídeo"
          disabled={indice === total - 1}
          onClick={() => ir(indice + 1)}
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

        {erro && (
          <p
            role="status"
            class="absolute inset-x-0 bottom-0 z-10 bg-onyx/90 p-3 text-step--1 text-pearl"
          >
            Vídeo indisponível no momento.
          </p>
        )}
      </div>

      <ul class="mx-auto mt-4 flex max-w-sm flex-wrap justify-center">
        {reels.map((r, n) => (
          <li key={r.id}>
            <button
              type="button"
              class="group flex h-11 w-11 cursor-pointer items-center justify-center"
              aria-label={`Ir para o vídeo ${n + 1} de ${total}`}
              aria-current={n === indice ? 'true' : undefined}
              onClick={() => ir(n)}
            >
              <span
                class={`block h-2 rounded-full transition-[width] duration-300 motion-reduce:transition-none ${
                  n === indice ? 'w-6 bg-velvet' : 'w-2 bg-velvet/60 group-hover:bg-velvet'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
      <p class="sr-only" aria-live="polite">
        Vídeo {indice + 1} de {total}
      </p>
    </div>
  );
}
