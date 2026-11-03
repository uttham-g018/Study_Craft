import { StudyKit } from '../types';

const STORAGE_KEY = 'studycraft_kits_history_v1';

export function getSavedKits(): StudyKit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load study kits from localStorage', e);
    return [];
  }
}

export function saveKitToHistory(kit: StudyKit): void {
  try {
    const existing = getSavedKits();
    // Prepend and filter duplicates
    const filtered = existing.filter((k) => k.id !== kit.id);
    const updated = [kit, ...filtered].slice(0, 20); // Keep last 20 kits
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save study kit to localStorage', e);
  }
}

export function removeKitFromHistory(id: string): StudyKit[] {
  try {
    const existing = getSavedKits();
    const updated = existing.filter((k) => k.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove study kit', e);
    return [];
  }
}
