import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  initSession,
  logout,
  avatarUrl,
  apiFetch,
  isValidUsername,
  sanitizeText,
  onAuthChange,
  type ModstackUser,
} from '../auth';

interface AuthButtonProps {
  className?: string;
}

type View = 'menu' | 'edit-name';

export default function AuthButton({ className = '' }: AuthButtonProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<ModstackUser | null>(getCurrentUser());
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('menu');
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(() => setUser(getCurrentUser()));
    return unsub;
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setView('menu');
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    setView('menu');
  };

  const handleNameSave = async () => {
    if (!isValidUsername(newName)) {
      setNameError('Username must be 3-16 characters: letters, numbers and _');
      return;
    }
    setSaving(true);
    setNameError('');
    try {
      const res = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ username: newName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNameError(sanitizeText(data.error) || 'Failed to update username.');
      } else {
        await initSession();
        setView('menu');
        setNewName('');
      }
    } catch {
      setNameError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      alert('Only PNG, JPEG, WEBP, or GIF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Max file size is 5MB.');
      return;
    }
    setAvatarLoading(true);
    try {
      const res = await apiFetch('/users/me/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(sanitizeText(data.error) || 'Failed to upload avatar.');
      } else {
        await initSession();
      }
    } catch {
      alert('Network error uploading avatar.');
    } finally {
      setAvatarLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Remove your avatar?')) return;
    try {
      const res = await apiFetch('/users/me/avatar', { method: 'DELETE' });
      if (res.ok) await initSession();
      else alert('Failed to remove avatar.');
    } catch {
      alert('Network error.');
    }
  };

  // Not logged in → simple Login button that navigates to /login
  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className={`!rounded-[8px] px-5 py-2 bg-[#5865F2] text-white shadow-[0_4px_0_rgb(71,82,196)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(71,82,196)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(71,82,196)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm font-medium ${className}`}
      >
        <span>Login</span>
      </button>
    );
  }

  const displayName = sanitizeText(user.username);
  const avatarSrc = avatarUrl(user.avatar);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => { setOpen(v => !v); setView('menu'); }}
        className="flex items-center gap-2 px-2 py-1.5 rounded-[8px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150"
      >
        <img
          src={avatarSrc}
          alt={displayName}
          className="w-7 h-7 rounded-full object-cover bg-zinc-700"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/avatar-default.png'; }}
        />
        <span className="text-white text-sm font-medium max-w-[100px] truncate hidden sm:block">
          {displayName}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-[#0f1923] border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
          style={{ minWidth: '220px' }}
        >
          {view === 'menu' && (
            <>
              {/* User header */}
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover bg-zinc-700"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/avatar-default.png'; }}
                  />
                  {avatarLoading && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                    <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{displayName}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">Modstack Account</div>
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="p-2">
                <button
                  onClick={() => { setNewName(user.username); setView('edit-name'); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Change username
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Change avatar
                </button>
                {user.avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Remove avatar
                  </button>
                )}
              </div>

              <div className="h-px bg-zinc-800 mx-2" />

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Log out
                </button>
              </div>
            </>
          )}

          {view === 'edit-name' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => { setView('menu'); setNameError(''); }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <span className="text-white text-sm font-semibold">Change username</span>
              </div>
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                  setNewName(val.slice(0, 16));
                  setNameError('');
                }}
                maxLength={16}
                placeholder="New username"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#2596be] mb-2"
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              />
              {nameError && (
                <p className="text-red-400 text-xs mb-2">{nameError}</p>
              )}
              <button
                onClick={handleNameSave}
                disabled={saving || !newName}
                className="w-full py-2 bg-[#2596be] hover:bg-[#2bb1e0] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
