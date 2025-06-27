// src/utils/bookingBackup.js
// Persistentes Backup-System für alle Buchungen (Finanzamt-konform)

const BACKUP_KEY = 'anna_booking_backup';
const BACKUP_VERSION = '1.0';

export const BookingBackup = {
  // Speichert Buchungen in localStorage UND IndexedDB für doppelte Sicherheit
  saveBookings: (bookings) => {
    try {
      const backupData = {
        version: BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        count: bookings.length,
        bookings: bookings
      };
      
      // 1. LocalStorage Backup
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
      
      // 2. IndexedDB Backup (für größere Datenmengen)
      if ('indexedDB' in window) {
        saveToIndexedDB(backupData);
      }
      
      console.log(`✅ Backup gespeichert: ${bookings.length} Buchungen`);
      return true;
    } catch (error) {
      console.error('❌ Backup-Fehler:', error);
      return false;
    }
  },
  
  // Lädt Buchungen aus dem Backup
  loadBookings: () => {
    try {
      // Versuche zuerst localStorage
      const localData = localStorage.getItem(BACKUP_KEY);
      if (localData) {
        const backupData = JSON.parse(localData);
        console.log(`✅ Backup geladen: ${backupData.count} Buchungen von ${new Date(backupData.timestamp).toLocaleString()}`);
        return backupData.bookings || [];
      }
      
      // Falls localStorage leer, versuche IndexedDB
      return loadFromIndexedDB();
    } catch (error) {
      console.error('❌ Fehler beim Laden des Backups:', error);
      return [];
    }
  },
  
  // Export als JSON für Finanzamt
  exportAsJSON: (bookings) => {
    const exportData = {
      export_date: new Date().toISOString(),
      export_version: BACKUP_VERSION,
      business: 'Sport 2000 Zell am See',
      total_bookings: bookings.length,
      total_revenue: bookings.reduce((sum, b) => sum + b.total_price, 0),
      bookings: bookings.map(booking => ({
        ...booking,
        export_timestamp: new Date().toISOString()
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sport2000_Buchungen_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // Export als CSV für Excel/Finanzamt
  exportAsCSV: (bookings) => {
    const headers = [
      'Buchungsnummer', 'Buchungsgruppe', 'Datum', 'Kunde', 'Email', 
      'Kategorie', 'Alter', 'Tage', 'Startdatum', 'Extras', 
      'Preis', 'Zahlungsstatus', 'Shop'
    ];
    
    const rows = bookings.map(b => [
      b.booking_id,
      b.booking_group_id || b.booking_id,
      new Date(b.timestamp).toLocaleDateString('de-DE'),
      b.customer_name,
      b.customer_email,
      b.category,
      b.age,
      b.days,
      b.start_date,
      (b.extras || []).join(';'),
      b.total_price.toFixed(2),
      b.payment_status,
      b.shop
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sport2000_Buchungen_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // Automatisches Backup alle 5 Minuten
  startAutoBackup: (getBookingsFunc) => {
    setInterval(() => {
      const bookings = getBookingsFunc();
      BookingBackup.saveBookings(bookings);
    }, 5 * 60 * 1000); // 5 Minuten
  }
};

// IndexedDB Helper Functions
async function saveToIndexedDB(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AnnaBookingDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('backups')) {
        db.createObjectStore('backups', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['backups'], 'readwrite');
      const store = transaction.objectStore('backups');
      
      const backupRecord = {
        id: 'main_backup',
        ...data
      };
      
      store.put(backupRecord);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  });
}

async function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AnnaBookingDB', 1);
    
    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      resolve([]);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('backups')) {
        resolve([]);
        return;
      }
      
      const transaction = db.transaction(['backups'], 'readonly');
      const store = transaction.objectStore('backups');
      const getRequest = store.get('main_backup');
      
      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (result && result.bookings) {
          console.log(`✅ IndexedDB Backup geladen: ${result.count} Buchungen`);
          resolve(result.bookings);
        } else {
          resolve([]);
        }
      };
      
      getRequest.onerror = () => {
        console.error('IndexedDB read error:', getRequest.error);
        resolve([]);
      };
    };
  });
}