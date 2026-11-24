import { computed } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';

const storageKey = 'matchmap.notifications.pending';

const readCount = (): number => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null || !/^\d+$/.test(raw)) {
      return 0;
    }
    return Number(raw);
  } catch {
    return 0;
  }
};

export const NotificationsStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ count: readCount() })),
  withComputed(({ count }) => ({
    pending: computed(() => count() > 0),
  })),
);
