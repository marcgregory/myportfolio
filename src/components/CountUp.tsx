import { useCountUp } from "@/hooks/useCountUp";
import {
  formatCountedValue,
  parseStatValue,
  type ParsedStatValue,
} from "@/utils/parseStatValue";

type CountUpProps = {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
};

const CountUp = ({ value, className, duration, delay }: CountUpProps) => {
  const parsed: ParsedStatValue = parseStatValue(value);
  const { count, ref } = useCountUp(parsed.end, {
    duration,
    delay,
    decimals: parsed.decimals,
  });

  return (
    <span ref={ref} className={className}>
      {formatCountedValue(count, parsed)}
    </span>
  );
};

export default CountUp;
