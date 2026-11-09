// Imagem de uma alternativa (ex.: questão "qual destas placas...").
// A imagem acompanha o TEXTO da alternativa no embaralhamento — ver
// `shuffleOptions` em src/data/questions.ts.
interface Props {
  src: string;
  alt?: string;
  className?: string;
}

export function OptionImage({ src, alt, className }: Props) {
  return (
    <img
      src={src}
      alt={alt ?? "imagem da alternativa"}
      loading="lazy"
      draggable={false}
      className={`shrink-0 object-contain max-h-[64px] md:max-h-[88px] w-auto max-w-[120px] ${className ?? ""}`}
    />
  );
}
