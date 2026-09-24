import { useEffect, useRef, useState } from 'preact/hooks';
import Lightbox from './Lightbox';
import type { FotoGaleriaOtimizada } from './galeria-tipos';

// Todas as fotos aparecem de início. Para limitar de novo, reduza INICIAL: o excedente vai para "Ver mais fotos".
const INICIAL = Infinity;
// No celular (abaixo de lg) a grade tem 3 colunas e mostra só as 3 primeiras de cada grupo de 5 fotos
// (as posições 4 e 5 de cada grupo ficam ocultas). No desktop aparecem todas.
const ocultaNoCelular = (i: number) => i % 5 >= 3;
const SIZES = '(min-width: 1024px) 20vw, 33vw';

export default function GaleriaFeed({ fotos }: { fotos: FotoGaleriaOtimizada[] }) {
  const [mostrar, setMostrar] = useState(INICIAL);
  const [aberta, setAberta] = useState<number | null>(null);
  const origem = useRef<HTMLElement | null>(null);
  const focoNovo = useRef<number | null>(null);
  const grade = useRef<HTMLUListElement>(null);

  const [celular, setCelular] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const atualizar = () => setCelular(mq.matches);
    atualizar();
    mq.addEventListener('change', atualizar);
    return () => mq.removeEventListener('change', atualizar);
  }, []);

  const visiveis = fotos.slice(0, mostrar);
  // Lista usada na foto ampliada: no celular, sem as fotos ocultas.
  const navegaveis = visiveis.filter((_, i) => !(celular && ocultaNoCelular(i)));
  const restantes = fotos.length - visiveis.length;

  useEffect(() => {
    if (focoNovo.current === null) return;
    grade.current?.querySelector<HTMLElement>(`[data-indice="${focoNovo.current}"]`)?.focus();
    focoNovo.current = null;
  }, [mostrar]);

  return (
    <div>
      <ul ref={grade} class="grid grid-cols-3 gap-1 sm:gap-1.5 lg:grid-cols-5">
        {visiveis.map((f, i) => (
          <li key={f.id} class={ocultaNoCelular(i) ? 'max-lg:hidden' : undefined}>
            <button
              type="button"
              data-indice={i}
              aria-haspopup="dialog"
              class="group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden"
              onClick={(e) => {
                origem.current = e.currentTarget;
                setAberta(i);
              }}
            >
              <picture>
                <source type="image/avif" srcset={f.thumb.avif} sizes={SIZES} />
                <source type="image/webp" srcset={f.thumb.webp} sizes={SIZES} />
                <img
                  src={f.thumb.src}
                  srcset={f.thumb.webp}
                  sizes={SIZES}
                  alt={f.alt}
                  width={f.thumb.largura}
                  height={f.thumb.altura}
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover"
                />
              </picture>
              <span
                class="absolute inset-0 bg-onyx/0 transition-colors group-hover:bg-onyx/25 group-focus-visible:bg-onyx/25"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>

      {restantes > 0 && (
        <div class="mt-8 flex justify-center">
          <button
            type="button"
            class="btn-ouro cursor-pointer rounded-full px-8 py-3.5 font-medium text-onyx"
            onClick={() => {
              focoNovo.current = visiveis.length;
              setMostrar(fotos.length);
            }}
          >
            Ver mais fotos ({restantes})
          </button>
        </div>
      )}

      {aberta !== null && (
        <Lightbox
          fotos={navegaveis}
          indice={Math.max(0, navegaveis.indexOf(visiveis[aberta]!))}
          onIr={(n) => setAberta(visiveis.indexOf(navegaveis[n]!))}
          onFechar={() => {
            setAberta(null);
            origem.current?.focus();
          }}
        />
      )}
    </div>
  );
}
