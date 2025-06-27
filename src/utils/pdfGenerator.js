import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

export const generateBookingPDF = (bookingData, persons, selectedShop, lang = 'de') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Translations
  const texts = {
    de: {
      title: 'BUCHUNGSBESTÄTIGUNG',
      bookingNumber: 'Buchungsnummer',
      pickupLocation: 'ABHOLUNGSORT',
      phone: 'Tel',
      openingHours: 'Öffnungszeiten',
      bookingDetails: 'BUCHUNGSDETAILS',
      name: 'Name',
      category: 'Kategorie',
      days: 'Tage',
      start: 'Start',
      price: 'Preis',
      day: 'Tag',
      totalAmount: 'GESAMTSUMME',
      paid: 'BEZAHLT',
      importantNotes: 'WICHTIGE HINWEISE',
      note1: 'Bringen Sie diesen Voucher und einen gültigen Ausweis zur Abholung mit',
      note2: 'Abholung ab Öffnung möglich',
      note3: 'Rückgabe bis 1 Stunde vor Geschäftsschluss',
      note4: 'Die Ausrüstung wird individuell an Sie angepasst',
      questionsCall: 'Bei Fragen',
      createdOn: 'Voucher erstellt am'
    },
    en: {
      title: 'BOOKING CONFIRMATION',
      bookingNumber: 'Booking Number',
      pickupLocation: 'PICKUP LOCATION',
      phone: 'Phone',
      openingHours: 'Opening Hours',
      bookingDetails: 'BOOKING DETAILS',
      name: 'Name',
      category: 'Category',
      days: 'Days',
      start: 'Start',
      price: 'Price',
      day: 'day',
      totalAmount: 'TOTAL AMOUNT',
      paid: 'PAID',
      importantNotes: 'IMPORTANT NOTES',
      note1: 'Bring this voucher and valid ID for pickup',
      note2: 'Pickup available from opening',
      note3: 'Return up to 1 hour before closing',
      note4: 'Equipment will be individually adjusted',
      questionsCall: 'For questions',
      createdOn: 'Voucher created on'
    }
  };
  
  const t = texts[lang] || texts.de;
  
  // Farben
  const primaryColor = [236, 0, 8]; // Sport2000 Rot
  
  // Header mit rotem Hintergrund
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo/Titel
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('SPORT 2000', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont(undefined, 'normal');
  doc.text('ZELL AM SEE', pageWidth / 2, 30, { align: 'center' });
  
  // Barcode generieren
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, bookingData.booking_number, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
    fontSize: 14,
    margin: 10
  });
  
  // Barcode ins PDF einfügen
  const barcodeData = canvas.toDataURL('image/png');
  doc.addImage(barcodeData, 'PNG', (pageWidth - 100) / 2, 45, 100, 30);
  
  // Voucher Titel
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(t.title, pageWidth / 2, 85, { align: 'center' });
  
  // Buchungsnummer
  doc.setFillColor(...primaryColor);
  doc.rect(20, 90, pageWidth - 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`${t.bookingNumber}: ${bookingData.booking_number}`, pageWidth / 2, 97, { align: 'center' });
  
  // Shop-Info Box
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`${t.pickupLocation}:`, 20, 115);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text(selectedShop.name, 20, 125);
  const address = typeof selectedShop.address === 'string' ? selectedShop.address : (selectedShop.address[lang] || selectedShop.address);
  doc.text(address, 20, 132);
  doc.text(`${t.phone}: ${selectedShop.phone}`, 20, 139);
  if (selectedShop.openingHours) {
    doc.text(`${t.openingHours}: ${selectedShop.openingHours}`, 20, 146);
  }
  
  // Buchungsdetails manuell (ohne autoTable)
  let yPosition = 160;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`${t.bookingDetails}:`, 20, yPosition);
  
  yPosition += 10;
  
  // Tabellen-Header
  doc.setFillColor(...primaryColor);
  doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(t.name, 25, yPosition);
  doc.text(t.category, 65, yPosition);
  doc.text(t.days, 100, yPosition);
  doc.text(t.start, 120, yPosition);
  doc.text(t.price, 170, yPosition);
  
  yPosition += 10;
  
  // Personen-Details
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  persons.forEach((person, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    }
    
    doc.text(person.customerName, 25, yPosition);
    doc.text(person.category, 65, yPosition);
    const daysText = lang === 'de' 
      ? `${person.days} Tag${person.days > 1 ? 'e' : ''}` 
      : `${person.days} ${t.day}${person.days > 1 ? 's' : ''}`;
    doc.text(daysText, 100, yPosition);
    doc.text(person.startDate ? new Date(person.startDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : '-', 120, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(`€ ${person.totalPrice.toFixed(2)}`, 170, yPosition);
    doc.setFont(undefined, 'normal');
    
    yPosition += 10;
  });
  
  // Gesamtsumme
  yPosition += 5;
  const total = persons.reduce((sum, p) => sum + p.totalPrice, 0);
  
  doc.setFillColor(34, 197, 94); // Grün
  doc.rect(20, yPosition, pageWidth - 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`${t.totalAmount}: € ${total.toFixed(2)} (${t.paid})`, pageWidth / 2, yPosition + 10, { align: 'center' });
  
  // Wichtige Hinweise
  yPosition += 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`${t.importantNotes}:`, 20, yPosition);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const hinweise = [
    `• ${t.note1}`,
    `• ${t.note2}`,
    `• ${t.note3}`,
    `• ${t.note4}`,
    `• ${t.questionsCall}: ${selectedShop.phone}`
  ];
  
  yPosition += 7;
  hinweise.forEach(hinweis => {
    doc.text(hinweis, 25, yPosition);
    yPosition += 7;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Sport 2000 Zell am See | booking@sport2000-zellamsee.at | +43 6767 440618', pageWidth / 2, 280, { align: 'center' });
  doc.text(`${t.createdOn}: ${new Date().toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')}`, pageWidth / 2, 285, { align: 'center' });
  
  return doc;
};