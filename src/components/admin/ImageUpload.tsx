'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewWidth?: number;
  previewHeight?: number;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Изображение',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка загрузки');
      } else {
        onChange(data.url);
      }
    } catch {
      setError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="admin-form-group">
      <label className="admin-form-label">{label}</label>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-form-input"
          placeholder="/uploads/image.jpg или https://..."
          style={{ flex: 1, minWidth: '200px' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="admin-btn admin-btn-secondary"
          style={{ whiteSpace: 'nowrap' }}
        >
          {uploading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="admin-spinner" style={{ width: '14px', height: '14px' }} />
              Загрузка...
            </span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Загрузить файл
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div style={{ color: 'var(--admin-danger)', fontSize: '13px', marginTop: '6px' }}>
          {error}
        </div>
      )}

      {value && (
        <div style={{ marginTop: '12px', width: '200px', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)', flexShrink: 0 }}>
          <Image
            src={value}
            alt="Preview"
            width={200}
            height={130}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
