import { Star } from "lucide-react";

interface StarsProps {
  value: number;
  size?: string;
}

export function Stars({ value, size = "w-4 h-4" }: StarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(value)
              ? "fill-amber-500 text-amber-500"
              : "text-neutral-200 fill-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}
