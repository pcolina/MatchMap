import { Injectable } from '@angular/core';
import * as SecureStore from 'expo-secure-store';

const KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class RefreshTokenStorage {
  write(refreshToken: string): Promise<void> {
    return SecureStore.setItemAsync(KEY, refreshToken);
  }

  read(): Promise<string | null> {
    return SecureStore.getItemAsync(KEY);
  }

  clear(): Promise<void> {
    return SecureStore.deleteItemAsync(KEY);
  }
}
