'use client';

import { useState } from 'react';

const EMOJI_GROUPS = [
  {
    label: 'Юридические',
    items: ['⚖️', '🏛️', '📜', '🔨', '👨‍⚖️', '👩‍⚖️', '🛡️', '🔏', '📋', '✍️', '🔍', '📁'],
  },
  {
    label: 'Бизнес',
    items: ['💼', '🤝', '📊', '💰', '🏢', '📈', '💡', '🌍', '🏦', '📑', '🗂️', '📌'],
  },
  {
    label: 'Области права',
    items: ['🏠', '🚗', '👪', '💊', '🌱', '✈️', '🔒', '💻', '🏗️', '🚢', '🎓', '❤️'],
  },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [custom, setCustom] = useState('');

  return (
    <div className="admin-form-group">
      <label className="admin-form-label">Иконка</label>

      {/* Current selection preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '12px', fontSize: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(212,175,55,0.12)', border: '2px solid #A38B4D',
        }}>
          {value}
        </div>
        <span style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>Выбрано</span>
      </div>

      {/* Emoji grid by group */}
      {EMOJI_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {group.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {group.items.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onChange(emoji)}
                style={{
                  width: '40px', height: '40px', fontSize: '20px', borderRadius: '8px',
                  border: value === emoji ? '2px solid #A38B4D' : '1px solid var(--admin-border)',
                  background: value === emoji ? 'rgba(212,175,55,0.12)' : 'var(--admin-bg)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Custom emoji input */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Или введите свой emoji..."
          className="admin-form-input"
          style={{ flex: 1 }}
          maxLength={8}
        />
        <button
          type="button"
          onClick={() => { if (custom.trim()) { onChange(custom.trim()); setCustom(''); } }}
          className="admin-btn admin-btn-secondary"
          disabled={!custom.trim()}
        >
          Применить
        </button>
      </div>
    </div>
  );
}
