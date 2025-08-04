export async function downloadImage(url: string, filename: string) {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(blobUrl); 
}

export async function downloadImageWithFilter(
  imageUrl: string,
  filename: string,
  filterStyle: string
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context is null");

      ctx.filter = filterStyle;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return reject("Failed to generate blob");

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        resolve();
      }, "image/png");
    };

    img.onerror = () => {
      reject("Failed to load image");
    };
  });
}
