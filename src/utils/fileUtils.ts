// Convert File to Base64 data and mimeType for Gemini multimodal input
export async function fileToBase64(file: File): Promise<{ data: string; mimeType: string; name: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result format is: "data:image/png;base64,iVBOR..."
      const commaIndex = result.indexOf(',');
      const base64Data = commaIndex !== -1 ? result.slice(commaIndex + 1) : result;
      resolve({
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
        name: file.name,
        size: file.size,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
