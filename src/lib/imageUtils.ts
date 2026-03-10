export function loadImageToCanvas(src: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export function normalizeCanvases(
  a: HTMLCanvasElement,
  b: HTMLCanvasElement
): { left: ImageData; right: ImageData; width: number; height: number } {
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);

  const normalize = (canvas: HTMLCanvasElement): ImageData => {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d")!;
    // Scale the source image to fill the target dimensions
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
  };

  return {
    left: normalize(a),
    right: normalize(b),
    width,
    height,
  };
}
