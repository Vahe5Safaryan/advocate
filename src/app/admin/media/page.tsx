'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  createdAt: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот файл?')) return;
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    setMedia(media.filter((m) => m.id !== id));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Ошибка загрузки');
      } else {
        setMedia((prev) => [data, ...prev]);
      }
    } catch {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Медиа-библиотека">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Файлы ({media.length})</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="admin-btn admin-btn-primary"
            >
              {uploading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="admin-spinner" style={{ width: '14px', height: '14px' }} />
                  Загрузка...
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  Загрузить файл
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </div>
          {uploadError && (
            <div style={{ color: 'var(--admin-danger)', fontSize: '13px', padding: '8px 0' }}>
              {uploadError}
            </div>
          )}
          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : media.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🖼️</div>
              <p>Файлов пока нет</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {media.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--admin-bg)',
                  }}
                >
                  {item.mimeType.startsWith('image/') ? (
                    <div style={{ position: 'relative', width: '100%', paddingTop: '60%', backgroundColor: '#f0f0f0' }}>
                      <Image
                        src={item.url}
                        alt={item.alt || item.filename}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', fontSize: '32px' }}>📄</div>
                  )}
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.filename}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                      {formatSize(item.size)}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <button
                        onClick={() => handleCopyUrl(item.url)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ flex: 1, fontSize: '11px' }}
                      >
                        {copied === item.url ? '✓ Скопировано' : 'Копировать URL'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        style={{ fontSize: '11px' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
