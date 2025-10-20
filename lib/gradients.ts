const gradientOptionsData = [
  {
    id: "none",
    name: "No gradient",
    swatchClass: "bg-white border border-slate-200",
    backgroundClass: "bg-white",
    highlightClass: "from-transparent to-transparent",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    swatchClass: "bg-gradient-to-br from-orange-200 via-rose-200 to-sky-200",
    backgroundClass: "bg-gradient-to-br from-orange-50 via-white to-sky-100",
    highlightClass: "from-orange-400/50 to-sky-400/50",
  },
  {
    id: "copper",
    name: "Copper",
    swatchClass: "bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200",
    backgroundClass: "bg-gradient-to-br from-amber-50 via-white to-rose-100",
    highlightClass: "from-amber-400/50 to-rose-400/50",
  },
  {
    id: "emerald",
    name: "Emerald",
    swatchClass: "bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200",
    backgroundClass: "bg-gradient-to-br from-emerald-50 via-white to-cyan-100",
    highlightClass: "from-emerald-400/50 to-cyan-400/50",
  },
  {
    id: "lilac",
    name: "Lilac",
    swatchClass: "bg-gradient-to-br from-fuchsia-200 via-purple-200 to-indigo-200",
    backgroundClass: "bg-gradient-to-br from-fuchsia-50 via-white to-indigo-100",
    highlightClass: "from-fuchsia-400/50 to-indigo-400/50",
  },
] as const;

export type GradientOption = (typeof gradientOptionsData)[number];

export type GradientId = GradientOption["id"];

export const gradientOptions: readonly GradientOption[] = gradientOptionsData;

export const defaultGradientId: GradientId = "sunrise";

export const gradientOptionMap = gradientOptions.reduce<Record<GradientId, GradientOption>>((acc, option) => {
  acc[option.id] = option;
  return acc;
}, {} as Record<GradientId, GradientOption>);

export const resolveGradient = (id?: string): GradientOption =>
  gradientOptions.find((option) => option.id === id) ??
  gradientOptions.find((option) => option.id === defaultGradientId) ??
  gradientOptions[0];
