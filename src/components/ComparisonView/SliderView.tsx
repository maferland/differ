import { useRef } from "react";
import { ImagePair } from "@/lib/types";
import { useSlider } from "@/hooks/useSlider";
import { useImageDimensions } from "@/hooks/useImageDimensions";
import { useFitSize } from "@/hooks/useFitSize";

interface SliderViewProps {
  pair: ImagePair;
}

export function SliderView({ pair }: SliderViewProps) {
  const { position, containerRef, onPointerDown, onPointerMove, onPointerUp } =
    useSlider();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const urls = [pair.left.objectUrl, pair.right.objectUrl];
  const dims = useImageDimensions(urls);
  const size = useFitSize(dims, { headerOffset: 180, containerRef: wrapperRef });

  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative cursor-col-resize select-none overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950"
        style={size ? { width: size.width, height: size.height } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <img
          src={pair.left.objectUrl}
          alt={pair.left.name}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
        <img
          src={pair.right.objectUrl}
          alt={pair.right.name}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          draggable={false}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{
            left: `${position}%`,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "-1px 0 3px rgba(0,0,0,0.5), 1px 0 3px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/60 shadow-[0_0_8px_rgba(0,0,0,0.6)] backdrop-blur" />
        </div>
      </div>
      <div className="flex w-full justify-between text-sm text-zinc-500">
        <span>{pair.left.name}</span>
        <span>{pair.right.name}</span>
      </div>
    </div>
  );
}
