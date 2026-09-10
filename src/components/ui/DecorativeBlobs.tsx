type DecorativeBlobsProps = {
  variant?: 1 | 2 | 3 | 4 | 5;
};

// Formes organiques asymétriques (même technique que le cadre photo du hero),
// floutées et en faible opacité, pour habiller le fond des sections sans
// distraire du contenu. Chaque variante propose une disposition différente
// pour éviter un motif qui se répète identique section après section.
const VARIANTS: Record<number, string[]> = {
  1: [
    "absolute -left-16 -top-14 h-72 w-72 rounded-[63%_37%_54%_46%/43%_37%_63%_57%] bg-accent/25 blur-xl",
    "absolute -right-12 bottom-0 h-56 w-56 rounded-[37%_63%_46%_54%/57%_43%_37%_63%] bg-sage/30 blur-xl",
  ],
  2: [
    "absolute -right-20 -top-16 h-80 w-80 rounded-[54%_46%_63%_37%/37%_63%_43%_57%] bg-sage/30 blur-xl",
    "absolute -left-14 bottom-6 h-64 w-64 rounded-[46%_54%_37%_63%/63%_37%_57%_43%] bg-accent/25 blur-xl",
  ],
  3: [
    "absolute left-1/3 -top-24 h-72 w-72 rounded-[43%_57%_63%_37%/54%_46%_37%_63%] bg-accent/20 blur-xl",
    "absolute -right-16 top-1/2 h-60 w-60 -translate-y-1/2 rounded-[63%_37%_43%_57%/37%_63%_54%_46%] bg-sage/30 blur-xl",
  ],
  4: [
    "absolute -left-10 top-1/4 h-64 w-64 rounded-[37%_63%_57%_43%/63%_37%_46%_54%] bg-accent/25 blur-xl",
    "absolute right-1/4 -bottom-20 h-72 w-72 rounded-[57%_43%_37%_63%/46%_54%_63%_37%] bg-sage/25 blur-xl",
  ],
  5: [
    "absolute -left-20 top-0 h-80 w-80 rounded-[46%_54%_63%_37%/57%_43%_37%_63%] bg-parchment/20 blur-xl",
    "absolute -right-14 -bottom-16 h-64 w-64 rounded-[63%_37%_46%_54%/43%_57%_63%_37%] bg-parchment/20 blur-xl",
  ],
};

export default function DecorativeBlobs({ variant = 1 }: DecorativeBlobsProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {VARIANTS[variant].map((className, index) => (
        <div key={index} className={className} />
      ))}
    </div>
  );
}
