import { useRef, useState } from 'react';
import { contentApi } from '@/shared/api/contentApi';

interface ImageUploadProps {
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

export function ImageUpload({ currentUrl, onUploaded }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const result = await contentApi.upload(file);
      setPreview(result.url);
      onUploaded(result.url);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Product Image</label>
      <div className="mt-1 flex items-center gap-4">
        {preview && (
          <img
            src={preview}
            alt="Product preview"
            className="h-20 w-20 rounded-md border border-gray-200 object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : preview ? 'Change Image' : 'Upload Image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          aria-label="Upload product image"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
