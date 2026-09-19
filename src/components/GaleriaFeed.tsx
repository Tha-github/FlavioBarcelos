import { useEffect, useRef, useState } from 'preact/hooks';
import Lightbox from './Lightbox';
import type { FotoGaleriaOtimizada } from './galeria-tipos';

// Com 20 fotos, todas aparecem de início. Se a galeria crescer, o excedente vai para "Ver mais fotos".
const INICIAL = 20;
const SIZES = '(min-width: 1024px) 20vw, 33vw';

export default function GaleriaFeed({ fotos }: { fotos: FotoGaleriaOtimizada[] }) {
  const [mostrar, setMostrar] = useState(INICIAL);
  const [aberta, setAberta] = useState<number | null>(null);
  const origem = useRef<HTMLElement | null>(null);
  const focoNovo = useRef<number | null>(null);
  const grade = useRef<HTMLUListElement>(null);

  const visiveis = fotos.slice(0, mostrar);
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
          <li key={f.id}>
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
            class="cursor-pointer rounded-full border-[1.5px] border-velvet px-8 py-3.5 font-medium text-velvet hover:bg-velvet hover:text-silk"
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
          fotos={fotos}
          indice={aberta}
          onIr={setAberta}
          onFechar={() => {
            setAberta(null);
            origem.current?.focus();
          }}
        />
      )}
    </div>
  );
}
