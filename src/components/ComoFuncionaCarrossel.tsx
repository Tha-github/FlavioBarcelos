import { useEffect, useRef, useState } from 'preact/hooks';

interface Passo {
  titulo: string;
  texto: string;
}

const seta =
  'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-velvet text-velvet hover:bg-velvet hover:text-silk disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-velvet';

export default function ComoFuncionaCarrossel({ passos }: { passos: Passo[] }) {
  const total = passos.length;
  const [atual, setAtual] = useState(0);
  const [pronto, setPronto] = useState(false);
  const toqueX = useRef<number | null>(null);
  const regiao = useRef<HTMLDivElement>(null);
  const interagiu = useRef(false);

  useEffect(() => setPronto(true), []);

  const ir = (n: number) => setAtual(Math.min(total - 1, Math.max(0, n)));

  // Se a seta focada ficar desabilitada (ponta do carrossel), o foco volta para a região
  // e as setas do teclado continuam funcionando.
  useEffect(() => {
    if (!interagiu.current) return;
    interagiu.current = false;
    const id = setTimeout(() => {
      const ativo = document.activeElement;
      if (
        regiao.current &&
        (ativo === document.body || (ativo instanceof HTMLButtonElement && ativo.disabled))
      ) {
        regiao.current.focus();
      }
    }, 0);
    return () => clearTimeout(id);
  }, [atual]);

  return (
    <div
      ref={regiao}
      tabIndex={-1}
      style={{ outline: 'none' }}
      onClickCapture={() => {
        interagiu.current = true;
      }}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Como funciona o atendimento"
      onKeyDown={(e) => {
        interagiu.current = true;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          ir(atual - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          ir(atual + 1);
        }
      }}
    >
      <div class="mx-auto flex max-w-2xl items-center gap-2 sm:gap-4">
        <button
          type="button"
          class={`como-controles ${seta}`}
          aria-label="Passo anterior"
          disabled={atual === 0}
          onClick={() => ir(atual - 1)}
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
          class="min-w-0 flex-1 touch-pan-y overflow-hidden"
          onTouchStart={(e) => {
            toqueX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const inicio = toqueX.current;
            toqueX.current = null;
            const fim = e.changedTouches[0]?.clientX;
            if (inicio === null || fim === undefined || Math.abs(fim - inicio) < 50) return;
            ir(fim < inicio ? atual + 1 : atual - 1);
          }}
        >
          <ol
            class="como-trilha flex transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${atual * 100}%)` }}
          >
            {passos.map((passo, n) => {
              const oculto = pronto && n !== atual;
              const inerte = oculto ? { inert: true } : {};
              return (
                <li
                  key={passo.titulo}
                  class="w-full shrink-0 px-2 sm:px-6"
                  aria-roledescription="slide"
                  aria-label={`${n + 1} de ${total}`}
                  aria-hidden={oculto ? 'true' : undefined}
                  {...inerte}
                >
                  <span
                    class="font-display text-step-5 leading-none text-velvet"
                    aria-hidden="true"
                  >
                    {n + 1}
                  </span>
                  <h3 class="mt-4 font-display text-step-3 tracking-titulo text-balance">
                    {passo.titulo}
                  </h3>
                  <p class="mt-3">{passo.texto}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <button
          type="button"
          class={`como-controles ${seta}`}
          aria-label="Próximo passo"
          disabled={atual === total - 1}
          onClick={() => ir(atual + 1)}
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
      <p class="como-controles mt-6 text-step--1 font-medium" aria-live="polite">
        Passo {atual + 1} de {total}
      </p>
    </div>
  );
}
