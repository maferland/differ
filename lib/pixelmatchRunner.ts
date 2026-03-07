import pixelmatch from "pixelmatch";
import { loadImageToCanvas, normalizeCanvases } from "./imageUtils";

export interface DiffResult {
  canvas: HTMLCanvasElement;
  diffPixels: number;
  totalPixels: number;
  percentage: number;
}

export async function runPixelDiff(
  leftSrc: string,
  rightSrc: string
): Promise<DiffResult> {
  const [leftCanvas, rightCanvas] = await Promise.all([
    loadImageToCanvas(leftSrc),
    loadImageToCanvas(rightSrc),
  ]);

  const { left, right, width, height } = normalizeCanvases(
    leftCanvas,
    rightCanvas
  );

  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = width;
  diffCanvas.height = height;
  const diffCtx = diffCanvas.getContext("2d")!;
  const diffImageData = diffCtx.createImageData(width, height);

  const diffPixels = pixelmatch(
    left.data,
    right.data,
    diffImageData.data,
    width,
    height,
    { threshold: 0.1 }
  );

  diffCtx.putImageData(diffImageData, 0, 0);
  const totalPixels = width * height;

  return {
    canvas: diffCanvas,
    diffPixels,
    totalPixels,
    percentage: (diffPixels / totalPixels) * 100,
  };
}
