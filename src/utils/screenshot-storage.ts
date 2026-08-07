const DB_NAME = 'TradeMasterSuite_UserData';
const STORE_NAME = 'screenshots';
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getScreenshotStoragePath(tradeId: string, type: 'before' | 'after' | 'chart'): string {
  const filename = type === 'before' ? 'before-entry.png' : type === 'after' ? 'after-entry.png' : 'chart-analysis.png';
  return `user-data/trades/${tradeId}/${filename}`;
}

export async function saveTradeScreenshot(
  tradeId: string,
  type: 'before' | 'after' | 'chart',
  file: File | Blob
): Promise<string> {
  const db = await openDatabase();
  const pathKey = getScreenshotStoragePath(tradeId, type);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(dataUrl, pathKey);
      req.onsuccess = () => resolve(dataUrl);
      req.onerror = () => reject(req.error);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function getTradeScreenshot(
  tradeId: string,
  type: 'before' | 'after' | 'chart'
): Promise<string | null> {
  const db = await openDatabase();
  const pathKey = getScreenshotStoragePath(tradeId, type);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const req = store.get(pathKey);
    req.onsuccess = () => resolve((req.result as string) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteTradeScreenshot(
  tradeId: string,
  type: 'before' | 'after' | 'chart'
): Promise<void> {
  const db = await openDatabase();
  const pathKey = getScreenshotStoragePath(tradeId, type);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const req = store.delete(pathKey);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
