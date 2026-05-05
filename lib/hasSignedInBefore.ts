import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'recurrly_has_signed_in_before';

let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

export async function getHasSignedInBefore(): Promise<boolean> {
  if (cached !== null) {
    return cached;
  }
  if (inflight) {
    return inflight;
  }
  inflight = AsyncStorage.getItem(STORAGE_KEY)
    .then((v) => {
      const result = v === 'true';
      cached = result;
      return result;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function setHasSignedInBefore(value: boolean): Promise<void> {
  cached = value;
  await AsyncStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
}
