export type ParsedStatValue = {
  prefix: string;
  end: number;
  suffix: string;
  decimals: number;
};

export const parseStatValue = (raw: string): ParsedStatValue => {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return { prefix: "", end: 0, suffix: raw, decimals: 0 };
  }

  const [, prefix = "", num, suffix = ""] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;

  return {
    prefix,
    end: Number(num),
    suffix,
    decimals,
  };
};

export const formatCountedValue = (
  count: number,
  { prefix, suffix, decimals }: ParsedStatValue
) => {
  const numeric =
    decimals > 0 ? count.toFixed(decimals) : String(Math.round(count));

  return `${prefix}${numeric}${suffix}`;
};
