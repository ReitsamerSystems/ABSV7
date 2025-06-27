import React, { useState, useEffect, useRef } from 'react';
import { Send, Settings, Loader, Shield, Download, Eye, Users, Euro, Calendar, CheckCircle, MapPin, MessageCircle, ShoppingCart, CreditCard, Mail, Phone, Clock, ChevronRight, Check, X, Edit2, Trash2, Plus, UserPlus, FileText, Printer, Home, Info, HelpCircle, LogOut, Globe, Save, Database, FileDown } from 'lucide-react';
import { generateBookingPDF } from './utils/pdfGenerator';
import AnimatedAnnaAvatar from './components/AnimatedAnnaAvatar';
import PaymentStep from './components/PaymentStep';
import { BookingBackup } from './utils/bookingBackup';

// ========== TRANSLATIONS ==========
const translations = {
  de: {
    language: "Deutsch",
    selectLanguage: "Sprache wählen",
    welcome: "Willkommen bei Sport 2000 Zell am See",
    chooseLanguage: "Bitte wählen Sie Ihre bevorzugte Sprache",
    continue: "Weiter",
    
    // Avatar Toggle
    hideAvatar: "Avatar ausblenden",
    showAvatar: "Avatar einblenden",
    
    // Chat Messages
    chatWelcome: "Hi! Ich bin Anna, Ihre digitale Assistentin von Sport 2000! 🎿 Ich helfe Ihnen gerne bei der Buchung Ihrer Skiausrüstung. Wir haben vier tolle Standorte zur Auswahl - wählen Sie einfach Ihren bevorzugten Shop aus!",
    shopSelected: "Excellent! Sie haben {shop} gewählt. Um Ihnen die besten Preise anzubieten, benötige ich zuerst Ihr Alter. Sind Sie ein Kind (bis 14), Jugendlich (15-17) oder Erwachsen (18+)?",
    ageSelected: "Super! Welche Ausrüstung darf es sein? Economy (günstig), Premium (beste Qualität-Preis) oder Platinum (High-End)?",
    categorySelected: "Großartig! Für wie viele Tage möchten Sie die Ausrüstung mieten?",
    daysSelected: "Wann möchten Sie mit dem Skifahren beginnen? Wählen Sie bitte Ihr Startdatum.",
    dateSelected: "Möchten Sie noch Extras wie Schuhe, Helm oder Versicherung dazu buchen?",
    extrasSelected: "Fast geschafft! Ich brauche nur noch Ihre Kontaktdaten für die Buchung.",
    contactComplete: "Perfekt! Möchten Sie noch eine weitere Person hinzufügen oder können wir zur Zahlung?",
    bookingConfirmed: "Vielen Dank für Ihre Buchung bei {shop}! Alles ist bestätigt und bereit für die Abholung. 🎿✨",
    
    // Headers
    annaAssistant: "Anna - Ihre Ski-Assistentin",
    selectShop: "Standort wählen",
    selectAge: "Alter angeben",
    selectCategory: "Kategorie wählen",
    selectDays: "Anzahl Tage",
    selectDate: "Startdatum",
    addExtras: "Extras hinzufügen",
    contactDetails: "Kontaktdaten",
    managePersons: "Personen verwalten",
    bookingConfirmedHeader: "Buchung bestätigt",
    
    // Buttons
    back: "Zurück",
    next: "Weiter",
    confirm: "Bestätigen",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    admin: "Admin",
    newBooking: "Neue Buchung starten",
    addPerson: "Weitere Person hinzufügen",
    toPayment: "Zur Zahlung",
    downloadVoucher: "Voucher drucken",
    sendEmail: "Email senden",
    emailSent: "Email gesendet",
    
    // Form Labels
    fullName: "Vollständiger Name",
    email: "E-Mail Adresse",
    age: "Alter",
    category: "Kategorie",
    days: "Tage",
    startDate: "Startdatum",
    extras: "Extras",
    price: "Preis",
    totalPrice: "Gesamtpreis",
    
    // Age Groups
    children: "Kinder",
    childrenDesc: "bis 14 Jahre",
    youth: "Jugendlich",
    youthDesc: "15-17 Jahre",
    adults: "Erwachsene",
    adultsDesc: "18+ Jahre",
    
    // Categories
    economyDesc: "Perfekt für Anfänger und Gelegenheitsskifahrer",
    premiumDesc: "Qualitäts-Skis für Fortgeschrittene",
    platinumDesc: "Premium Skis für fortgeschrittene Skifahrer",
    snowboardDesc: "Snowboards für alle Könnerstufen",
    
    // Extras
    bootsDesc: "Professionelle Ski-/Snowboardschuhe",
    helmetDesc: "Sicherheitshelm",
    insuranceDesc: "Ausrüstungsversicherung",
    
    // Shop Info
    openingHours: "Öffnungszeiten",
    phone: "Telefon",
    address: "Adresse",
    pickupLocation: "Abholungsort",
    
    // Booking Details
    bookingNumber: "Buchungsnummer",
    bookingDetails: "Buchungsdetails",
    bookingOverview: "Buchungsübersicht",
    yourSelection: "Ihre Auswahl",
    persons: "Personen",
    totalAmount: "Gesamtsumme",
    paid: "Bezahlt",
    pending: "Ausstehend",
    
    // Messages
    processing: "Verarbeitung...",
    creatingVoucher: "Erstelle Voucher...",
    sendingEmail: "Sende Email...",
    bookingSuccessful: "Buchung erfolgreich bestätigt!",
    equipmentReserved: "Ihre Skiausrüstung ist reserviert und bereit für die Abholung!",
    
    // Season Info
    skiSeason: "Skisaison 2024/2025",
    availableFrom: "Verfügbar von",
    to: "bis",
    
    // Admin
    adminLogin: "Admin Login",
    username: "Benutzername",
    password: "Passwort",
    login: "Anmelden",
    logout: "Abmelden",
    backToChat: "Zurück zum Chat",
    viewChat: "Chat ansehen",
    bookingDashboard: "Anna Buchungs-Dashboard",
    bookingGroups: "Buchungsgruppen",
    totalRevenue: "Gesamt Umsatz",
    avgPersonsPerBooking: "Ø Personen/Buchung",
    allBookings: "Alle Buchungen",
    search: "Suchen nach Name, Email, Kategorie oder Shop...",
    noBookingsFound: "Keine Buchungen gefunden",
    groups: "Gruppen",
    
    // Important Notes
    importantNotes: "Wichtige Hinweise",
    bringID: "Bringen Sie einen gültigen Ausweis zur Abholung mit",
    pickupFromOpening: "Abholung ab Öffnung möglich",
    returnBefore: "Rückgabe bis 1 Stunde vor Geschäftsschluss",
    questionsCall: "Bei Fragen erreichen Sie uns unter",
    
    // Chat Commands
    askQuestion: "Frage stellen",
    showLocations: "Standorte",
    
    // Help Messages
    cannotDeleteLast: "Sie können nicht die letzte Person löschen! Mindestens eine Person muss in der Buchung bleiben.",
    personDeleted: "Person wurde erfolgreich entfernt!",
    personUpdated: "Person wurde erfolgreich aktualisiert!",
    dateOutOfSeason: "Das gewählte Datum liegt außerhalb der Skisaison! Bitte wählen Sie ein Datum zwischen {start} und {end}.",
    
    // Q&A Topics
    pricesAndOffers: "Preise & Angebote",
    locationsAndHours: "Standorte & Öffnungszeiten",
    equipment: "Ausrüstung",
    skiAreas: "Skigebiete",
    bookingProcess: "Buchungsprozess",
    contact: "Kontakt",
    
    // Footer
    noBookingsYet: "Noch keine Buchungen",
    selectShopToStart: "Wählen Sie einen Shop aus, um zu beginnen"
  },
  
  en: {
    language: "English",
    selectLanguage: "Select Language",
    welcome: "Welcome to Sport 2000 Zell am See",
    chooseLanguage: "Please choose your preferred language",
    continue: "Continue",
    
    // Avatar Toggle
    hideAvatar: "Hide avatar",
    showAvatar: "Show avatar",
    
    // Chat Messages
    chatWelcome: "Hi! I'm Anna, your digital assistant from Sport 2000! 🎿 I'd be happy to help you book your ski equipment. We have four great locations to choose from - just select your preferred shop!",
    shopSelected: "Excellent! You've chosen {shop}. To offer you the best prices, I first need your age. Are you a child (up to 14), youth (15-17) or adult (18+)?",
    ageSelected: "Great! What equipment would you like? Economy (affordable), Premium (best quality-price) or Platinum (high-end)?",
    categorySelected: "Wonderful! For how many days would you like to rent the equipment?",
    daysSelected: "When would you like to start skiing? Please choose your start date.",
    dateSelected: "Would you like to add extras like boots, helmet or insurance?",
    extrasSelected: "Almost done! I just need your contact details for the booking.",
    contactComplete: "Perfect! Would you like to add another person or shall we proceed to payment?",
    bookingConfirmed: "Thank you for your booking at {shop}! Everything is confirmed and ready for pickup. 🎿✨",
    
    // Headers
    annaAssistant: "Anna - Your Ski Assistant",
    selectShop: "Select Location",
    selectAge: "Enter Age",
    selectCategory: "Choose Category",
    selectDays: "Number of Days",
    selectDate: "Start Date",
    addExtras: "Add Extras",
    contactDetails: "Contact Details",
    managePersons: "Manage Persons",
    bookingConfirmedHeader: "Booking Confirmed",
    
    // Buttons
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    admin: "Admin",
    newBooking: "Start New Booking",
    addPerson: "Add Another Person",
    toPayment: "To Payment",
    downloadVoucher: "Print Voucher",
    sendEmail: "Send Email",
    emailSent: "Email Sent",
    
    // Form Labels
    fullName: "Full Name",
    email: "Email Address",
    age: "Age",
    category: "Category",
    days: "Days",
    startDate: "Start Date",
    extras: "Extras",
    price: "Price",
    totalPrice: "Total Price",
    
    // Age Groups
    children: "Children",
    childrenDesc: "up to 14 years",
    youth: "Youth",
    youthDesc: "15-17 years",
    adults: "Adults",
    adultsDesc: "18+ years",
    
    // Categories
    economyDesc: "Perfect for beginners and casual skiers",
    premiumDesc: "Quality skis for advanced skiers",
    platinumDesc: "Premium skis for expert skiers",
    snowboardDesc: "Snowboards for all skill levels",
    
    // Extras
    bootsDesc: "Professional ski/snowboard boots",
    helmetDesc: "Safety helmet",
    insuranceDesc: "Equipment insurance",
    
    // Shop Info
    openingHours: "Opening Hours",
    phone: "Phone",
    address: "Address",
    pickupLocation: "Pickup Location",
    
    // Booking Details
    bookingNumber: "Booking Number",
    bookingDetails: "Booking Details",
    bookingOverview: "Booking Overview",
    yourSelection: "Your Selection",
    persons: "Persons",
    totalAmount: "Total Amount",
    paid: "Paid",
    pending: "Pending",
    
    // Messages
    processing: "Processing...",
    creatingVoucher: "Creating voucher...",
    sendingEmail: "Sending email...",
    bookingSuccessful: "Booking successfully confirmed!",
    equipmentReserved: "Your ski equipment is reserved and ready for pickup!",
    
    // Season Info
    skiSeason: "Ski Season 2024/2025",
    availableFrom: "Available from",
    to: "to",
    
    // Admin
    adminLogin: "Admin Login",
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    backToChat: "Back to Chat",
    viewChat: "View Chat",
    bookingDashboard: "Anna Booking Dashboard",
    bookingGroups: "Booking Groups",
    totalRevenue: "Total Revenue",
    avgPersonsPerBooking: "Avg Persons/Booking",
    allBookings: "All Bookings",
    search: "Search by name, email, category or shop...",
    noBookingsFound: "No bookings found",
    groups: "groups",
    
    // Important Notes
    importantNotes: "Important Notes",
    bringID: "Bring valid ID for pickup",
    pickupFromOpening: "Pickup available from opening",
    returnBefore: "Return up to 1 hour before closing",
    questionsCall: "For questions call us at",
    
    // Chat Commands
    askQuestion: "Ask Question",
    showLocations: "Locations",
    
    // Help Messages
    cannotDeleteLast: "You cannot delete the last person! At least one person must remain in the booking.",
    personDeleted: "Person successfully removed!",
    personUpdated: "Person successfully updated!",
    dateOutOfSeason: "The selected date is outside the ski season! Please choose a date between {start} and {end}.",
    
    // Q&A Topics
    pricesAndOffers: "Prices & Offers",
    locationsAndHours: "Locations & Hours",
    equipment: "Equipment",
    skiAreas: "Ski Areas",
    bookingProcess: "Booking Process",
    contact: "Contact",
    
    // Footer
    noBookingsYet: "No bookings yet",
    selectShopToStart: "Select a shop to begin"
  }
};

// Translation helper
const t = (key, lang = 'de', replacements = {}) => {
  let text = translations[lang][key] || key;
  
  // Replace placeholders like {shop} with actual values
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return text;
};

// ========== ORIGINAL PRICING & DATA ==========
const PRICING = {
  "Economy": {
    "adults": [29, 57, 85, 113, 127, 139],
    "youth": [23.20, 45.60, 68, 90.40, 101.60, 111.20],
    "children": [14.50, 28.50, 42.50, 56.50, 63.50, 69.50]
  },
  "Premium": {
    "adults": [35, 69, 103, 137, 155, 169],
    "youth": [28, 55.20, 82.40, 109.60, 124, 135.20]
  },
  "Platinum": {
    "adults": [42, 83, 124, 165, 183, 199]
  },
  "Snowboard": {
    "adults": [35, 69, 103, 137, 155, 169],
    "youth": [28, 55.20, 82.40, 109.60, 124, 135.20],
    "children": [17.50, 34.50, 51.50, 68.50, 77.50, 84.50]
  }
};

const PRICING_WITH_BOOTS = {
  "Economy": {
    "adults": [44, 80, 116, 152, 172, 188],
    "youth": [35.20, 64, 92.80, 121.60, 137.60, 150.40],
    "children": [22, 40, 58, 76, 86, 94]
  },
  "Premium": {
    "adults": [50, 92, 134, 176, 200, 218],
    "youth": [40, 73.60, 107.20, 140.80, 160, 174.40]
  },
  "Platinum": {
    "adults": [57, 106, 155, 204, 228, 248]
  }
};

const EXTRAS_PRICING = {
  "Boots": {
    "adults": [15, 23, 31, 39, 45, 49],
    "youth": [12, 18.40, 24.80, 31.20, 36, 39.20],
    "children": [7.50, 11.50, 15.50, 19.50, 22.50, 24.50]
  },
  "Helmet": {
    "adults": [8, 13, 18, 23, 27, 29],
    "youth": [6.40, 10.40, 14.40, 18.40, 21.60, 23.20],
    "children": [4, 6.50, 9, 11.50, 13.50, 14.50]
  },
  "Insurance": {
    "adults": [10, 10, 10, 10, 10, 10],
    "youth": [10, 10, 10, 10, 10, 10],
    "children": [5, 5, 5, 5, 5, 5]
  }
};

const SHOPS = [
  {
    id: 'schmitten',
    name: 'Sport2000 Schmitten',
    location: 'Schmitten',
    address: 'Schmittenstraße 125, 5700 Zell am See',
    phone: '+43 6767 440618',
    openingHours: '08:30 - 12:00 / 14:00 - 17:00',
    icon: '⛷️',
    color: 'red',
    description: {
      de: 'Direkt an der Schmittenhöhebahn / TrassXpress / Sonnenalmbahn',
      en: 'Right at the Schmittenhöhebahn / TrassXpress / Sonnenalmbahn'
    }
  },
  {
    id: 'zellamsee',
    name: 'Sport2000 Zell am See',
    location: 'Zell am See',
    address: 'Hypolitstraße 5 / Postplatz, 5700 Zell am See',
    phone: '+43 6767 440618',
    openingHours: '08:30 - 12:00 / 14:00 - 17:00',
    icon: '🏞️',
    color: 'red',
    description: {
      de: 'Im Zentrum von Zell am See am Postplatz',
      en: 'In the center of Zell am See at Postplatz'
    }
  },
  {
    id: 'areit',
    name: 'Sport2000 Areit',
    location: 'Areit',
    address: 'Flugplatzstraße 16, 5700 Zell am See',
    phone: '+43 6767 440618',
    openingHours: '08:30 - 12:00 / 14:00 - 17:00',
    icon: '🏔️',
    color: 'red',
    description: {
      de: 'Direkt am Parkplatz II der Areitbahn in Schüttdorf',
      en: 'Right at parking lot II of the Areitbahn in Schüttdorf'
    }
  },
  {
    id: 'amiamo',
    name: 'Hotelshop Amiamo',
    location: 'Amiamo Hotel',
    address: {
      de: 'Exklusiver Hotelshop, 5700 Zell am See',
      en: 'Exclusive hotel shop, 5700 Zell am See'
    },
    phone: '+43 6767 440618',
    openingHours: '',
    icon: '🏨',
    color: 'red',
    description: {
      de: 'Exklusiver Service direkt im Hotel',
      en: 'Exclusive service directly in the hotel'
    }
  }
];

// Helper functions
const calculatePrice = (category, ageGroup, days, selectedExtras) => {
  const dayIndex = Math.min(days - 1, 5);
  let basePrice = 0;
  const hasBoots = selectedExtras.includes('Boots');
  
  if (hasBoots && PRICING_WITH_BOOTS[category] && PRICING_WITH_BOOTS[category][ageGroup]) {
    basePrice = PRICING_WITH_BOOTS[category][ageGroup][dayIndex] || 0;
  } else if (PRICING[category] && PRICING[category][ageGroup]) {
    basePrice = PRICING[category][ageGroup][dayIndex] || 0;
  }
  
  let extrasPrice = 0;
  selectedExtras.forEach(extra => {
    if (extra !== 'Boots' && EXTRAS_PRICING[extra] && EXTRAS_PRICING[extra][ageGroup]) {
      const extraPrice = EXTRAS_PRICING[extra][ageGroup][dayIndex] || 0;
      extrasPrice += extraPrice;
    }
  });
  
  return basePrice + extrasPrice;
};

const getAgeGroup = (age) => {
  if (age <= 14) return 'children';
  if (age <= 17) return 'youth';
  return 'adults';
};

const isValidSeasonDate = (date) => {
  const selectedDate = new Date(date);
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  
  let seasonStartYear, seasonEndYear;
  
  if (currentDate.getMonth() < 4 || (currentDate.getMonth() === 3 && currentDate.getDate() <= 30)) {
    seasonStartYear = currentYear - 1;
    seasonEndYear = currentYear;
  } else if (currentDate.getMonth() >= 11) {
    seasonStartYear = currentYear;
    seasonEndYear = currentYear + 1;
  } else {
    seasonStartYear = currentYear;
    seasonEndYear = currentYear + 1;
  }
  
  const seasonStart = new Date(seasonStartYear, 11, 1);
  const seasonEnd = new Date(seasonEndYear, 3, 30);
  
  return selectedDate >= seasonStart && selectedDate <= seasonEnd;
};

const getAvailableDateRange = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  let seasonStartYear, seasonEndYear;
  
  if (currentDate.getMonth() < 4 || (currentDate.getMonth() === 3 && currentDate.getDate() <= 30)) {
    seasonStartYear = currentYear - 1;
    seasonEndYear = currentYear;
  } else if (currentDate.getMonth() >= 11) {
    seasonStartYear = currentYear;
    seasonEndYear = currentYear + 1;
  } else {
    seasonStartYear = currentYear;
    seasonEndYear = currentYear + 1;
  }
  
  const seasonStart = new Date(seasonStartYear, 11, 1);
  const seasonEnd = new Date(seasonEndYear, 3, 30);
  
  const minDate = currentDate > seasonStart ? currentDate : seasonStart;
  
  return {
    min: minDate.toISOString().split('T')[0],
    max: seasonEnd.toISOString().split('T')[0],
    seasonStart: seasonStart.toLocaleDateString('de-DE'),
    seasonEnd: seasonEnd.toLocaleDateString('de-DE')
  };
};

// ========== LANGUAGE SELECTOR COMPONENT ==========
function LanguageSelector({ onLanguageSelect }) {
  const [hoveredLang, setHoveredLang] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ec0008] to-[#a50006] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <img src="/assets/Sport_2000_rgb.png" alt="Sport 2000 Logo" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Sport 2000 Zell am See
          </h1>
          <p className="text-lg text-gray-600">
            Willkommen bei Sport 2000 Zell am See
          </p>
        </div>
        
        <div className="mb-8">
          <p className="text-center text-gray-700 mb-6">
            Please choose your preferred language / Bitte wählen Sie Ihre bevorzugte Sprache
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => onLanguageSelect('en')}
              onMouseEnter={() => setHoveredLang('en')}
              onMouseLeave={() => setHoveredLang(null)}
              className="bg-white border-3 border-gray-200 rounded-xl p-8 hover:border-[#ec0008] hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="text-6xl mb-4">🇬🇧</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">English</h3>
              <p className="text-gray-600">Continue in English</p>
              {hoveredLang === 'en' && (
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#ec0008] text-white">
                    Select →
                  </span>
                </div>
              )}
            </button>
            
            <button
              onClick={() => onLanguageSelect('de')}
              onMouseEnter={() => setHoveredLang('de')}
              onMouseLeave={() => setHoveredLang(null)}
              className="bg-white border-3 border-gray-200 rounded-xl p-8 hover:border-[#ec0008] hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="text-6xl mb-4">🇩🇪🇦🇹</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Deutsch</h3>
              <p className="text-gray-600">Auf Deutsch fortfahren</p>
              {hoveredLang === 'de' && (
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#ec0008] text-white">
                    Auswählen →
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Sport 2000 Zell am See | +43 6767 440618</p>
        </div>
      </div>
    </div>
  );
}

// ========== ANNA AVATAR COMPONENT ==========
const AnnaAvatar = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <img
      src="/assets/Sport_2000_rgb.png"
      alt="Sport2000 Logo"
      className={`${sizeClasses[size]} object-contain rounded`}
    />
  );
};

// ========== CHAT INTERFACE COMPONENT ==========
const ChatInterface = ({ lang, setLang, skiCategories, extras, allBookings, setAllBookings, setCurrentView }) => {
  const [chatStep, setChatStep] = useState(0);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [editingPersonIndex, setEditingPersonIndex] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isQuestionMode, setIsQuestionMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [currentBookingNumber, setCurrentBookingNumber] = useState('');
  const [chatMode, setChatMode] = useState('booking'); // 'booking' oder 'question'
  const [savedBookingState, setSavedBookingState] = useState(null); // Speichert Buchungszustand bei Fragen
  
  const [persons, setPersons] = useState([{
    age: null,
    category: null,
    days: 0,
    startDate: '',
    extras: [],
    customerName: '',
    customerEmail: '',
    totalPrice: 0
  }]);
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      message: t('chatWelcome', lang),
      timestamp: new Date()
    }
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load bookings from backup on mount
  useEffect(() => {
    console.log('📥 Lade Backup...');
    const backupBookings = BookingBackup.loadBookings();
    if (backupBookings && backupBookings.length > 0) {
      setAllBookings(backupBookings);
      console.log(`✅ ${backupBookings.length} Buchungen aus Backup geladen`);
    }
    
    // Start auto-backup
    BookingBackup.startAutoBackup(() => allBookings);
  }, []);

  // Save bookings to backup whenever they change
  useEffect(() => {
    if (allBookings.length > 0) {
      BookingBackup.saveBookings(allBookings);
    }
  }, [allBookings]);

  // Send initial greeting to avatar when component mounts
  useEffect(() => {
    if (window.annaAvatar && window.annaAvatar.speak) {
      window.annaAvatar.speak(t('chatWelcome', lang));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role, message) => {
    setMessages(prev => [...prev, {
      role,
      message,
      timestamp: new Date()
    }]);
  };

  // Helper function to add assistant message and speak through avatar
  const addAssistantMessage = (message) => {
    addMessage('assistant', message);
    
    // Send to avatar to speak
    if (window.annaAvatar && window.annaAvatar.speak) {
      window.annaAvatar.speak(message);
    }
  };

  const getCurrentPerson = () => persons[currentPersonIndex];
  const updateCurrentPerson = (updates) => {
    setPersons(prev => prev.map((person, index) => 
      index === currentPersonIndex ? { ...person, ...updates } : person
    ));
  };

  // Email sending function
  const sendBookingEmail = async (bookingData, persons, selectedShop) => {
    try {
      console.log('📧 Erstelle PDF mit Barcode...');
      
      // PDF mit Barcode generieren
      const pdf = generateBookingPDF(bookingData, persons, selectedShop, lang);
      const pdfBase64 = pdf.output('datauristring');
      
      console.log('📧 Sende Buchungsbestätigung mit PDF...');
      
      const response = await fetch('http://localhost:3001/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          persons,
          selectedShop,
          pdfBase64, // PDF mit Barcode
          lang // Sprache hinzufügen
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Email mit PDF-Voucher erfolgreich gesendet:', result.messageId);
        return {
          success: true,
          message: result.message
        };
      } else {
        throw new Error(result.error || 'Unbekannter Email-Fehler');
      }
    } catch (error) {
      console.error('❌ Email-Versand fehlgeschlagen:', error);
      const errorMsg = error.message.includes('fetch') 
        ? (lang === 'de' ? 'Email-Service nicht erreichbar. Stellen Sie sicher, dass der Server läuft.' : 'Email service not available. Please ensure the server is running.')
        : (lang === 'de' ? `Email-Versand fehlgeschlagen: ${error.message}` : `Email send failed: ${error.message}`);
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  // Handle Download Voucher
  const handleDownloadVoucher = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const bookingData = {
        booking_number: currentBookingNumber,
        timestamp: new Date().toISOString()
      };
      
      // PDF mit Barcode generieren
      const pdf = generateBookingPDF(bookingData, persons, selectedShop, lang);
      
      // PDF downloaden
      pdf.save(`Voucher_${bookingData.booking_number}.pdf`);
      
      addAssistantMessage(lang === 'de' ? '✅ Voucher mit Barcode wurde heruntergeladen!' : '✅ Voucher with barcode was downloaded!');
    } catch (error) {
      console.error('Voucher-Generation Fehler:', error);
      addAssistantMessage(lang === 'de' ? '❌ Fehler beim Voucher-Download. Bitte versuchen Sie es erneut.' : '❌ Error downloading voucher. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle Send Booking Voucher
  const handleSendBookingVoucher = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const bookingData = {
        booking_number: currentBookingNumber,
        timestamp: new Date().toISOString()
      };
      
      addAssistantMessage(lang === 'de' ? '📧 Sende Buchungsbestätigung erneut...' : '📧 Resending booking confirmation...');
      
      const emailResult = await sendBookingEmail(bookingData, persons, selectedShop);
      
      if (emailResult.success) {
        setEmailSent(true);
        addAssistantMessage(`✅ ${emailResult.message}`);
      } else {
        addAssistantMessage(`❌ ${emailResult.message}`);
      }
      
    } catch (error) {
      console.error('Voucher-Versand Fehler:', error);
      addAssistantMessage(lang === 'de' ? '❌ Fehler beim Versenden der Buchungsbestätigung.' : '❌ Error sending booking confirmation.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const message = userInput.trim();
    setUserInput('');
    addMessage('user', message);
    
    const lowerMessage = message.toLowerCase();
    
    // Prüfe ob Nutzer während Buchung eine Frage stellt
    if (chatStep > 0 && chatStep < 9) {
      // Keywords die auf Fragen hindeuten
      const questionKeywords = [
        'was', 'wie', 'wo', 'wann', 'warum', 'welche', 'wieviel', 'kostet',
        'what', 'how', 'where', 'when', 'why', 'which', 'much', 'cost',
        '?', 'preis', 'price', 'öffnung', 'open', 'adresse', 'address'
      ];
      
      const isQuestion = questionKeywords.some(keyword => lowerMessage.includes(keyword));
      
      if (isQuestion) {
        // Speichere aktuellen Buchungszustand
        setSavedBookingState({
          step: chatStep,
          persons: [...persons],
          currentPersonIndex,
          selectedShop
        });
        
        setChatMode('question');
        await processUserMessage(message);
        
        // Nach der Antwort frage, ob weitermachen
        setTimeout(() => {
          addAssistantMessage(lang === 'de' 
            ? '👍 Gerne beantworte ich Ihre Frage! Möchten Sie danach mit der Buchung fortfahren? Schreiben Sie "weiter" oder stellen Sie weitere Fragen.'
            : '👍 Happy to answer your question! Would you like to continue with the booking afterwards? Type "continue" or ask more questions.'
          );
        }, 1000);
        return;
      }
    }
    
    // Prüfe ob Nutzer zur Buchung zurück will
    if (chatMode === 'question' && savedBookingState && 
        (lowerMessage.includes('weiter') || lowerMessage.includes('continue') || 
         lowerMessage.includes('buchung') || lowerMessage.includes('booking'))) {
      // Stelle Buchungszustand wieder her
      setChatStep(savedBookingState.step);
      setPersons(savedBookingState.persons);
      setCurrentPersonIndex(savedBookingState.currentPersonIndex);
      setSelectedShop(savedBookingState.selectedShop);
      setChatMode('booking');
      setSavedBookingState(null);
      
      addAssistantMessage(lang === 'de'
        ? '✅ Sehr gut! Lassen Sie uns mit Ihrer Buchung fortfahren. Wo waren wir stehengeblieben...'
        : '✅ Great! Let\'s continue with your booking. Where were we...'
      );
      return;
    }
    
    // Check if user wants to start a booking
    if (lowerMessage.includes(lang === 'de' ? 'buchen' : 'book') || 
        lowerMessage.includes(lang === 'de' ? 'buchung' : 'booking')) {
      setIsQuestionMode(false);
      setChatMode('booking');
      setChatStep(0);
      setSelectedShop(null);
      setSavedBookingState(null);
      const welcomeMessage = t('chatWelcome', lang);
      addMessage('assistant', welcomeMessage);
      
      // Send to avatar to speak
      if (window.annaAvatar && window.annaAvatar.speak) {
        window.annaAvatar.speak(welcomeMessage);
      }
      return;
    }
    
    // Process questions through GPT if in question mode or no active booking
    if (chatMode === 'question' || chatStep === 0) {
      await processUserMessage(message);
    }
  };

  const processUserMessage = async (message) => {
    if (!isQuestionMode && chatStep === 0) return; // Only process in question mode or during booking questions
    
    setIsLoading(true);
    
    try {
      // Call GPT API
      const response = await fetch('http://localhost:3001/api/chat/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          chatHistory: messages.slice(-10), // Last 10 messages for context
          lang: lang,
          context: {
            selectedShop: selectedShop?.name,
            currentStep: chatStep
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from GPT');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Add GPT response to chat
        addMessage('assistant', data.message);
        
        // Send response to D-ID Avatar to speak
        if (window.annaAvatar && window.annaAvatar.speak) {
          window.annaAvatar.speak(data.message);
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = lang === 'de' 
        ? 'Entschuldigung, ich hatte Probleme das zu verstehen. Können Sie es bitte nochmal versuchen?'
        : 'Sorry, I had trouble understanding that. Could you please try again?';
      addMessage('assistant', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopSelection = async (shop) => {
    setSelectedShop(shop);
    setChatStep(1);
    addMessage('user', `${lang === 'de' ? 'Ich wähle' : 'I choose'} ${shop.name}`);
    addAssistantMessage(t('shopSelected', lang, { shop: shop.name }));
  };

  const handleAgeSelection = async (age) => {
    updateCurrentPerson({ age });
    setChatStep(2);
    addMessage('user', `${lang === 'de' ? 'Ich bin' : 'I am'} ${age} ${lang === 'de' ? 'Jahre alt' : 'years old'}`);
    addAssistantMessage(t('ageSelected', lang));
  };

  const handleCategorySelection = async (category) => {
    updateCurrentPerson({ category: category.name });
    setChatStep(3);
    addMessage('user', `${lang === 'de' ? 'Ich möchte' : 'I want'} ${category.name}`);
    addAssistantMessage(t('categorySelected', lang));
  };

  const handleDaysSelection = async (days) => {
    updateCurrentPerson({ days });
    setChatStep(4);
    addMessage('user', `${days} ${lang === 'de' ? `Tag${days > 1 ? 'e' : ''}` : `day${days > 1 ? 's' : ''}`}`);
    addAssistantMessage(t('daysSelected', lang));
  };

  const handleStartDateSelection = async (startDate) => {
    if (!isValidSeasonDate(startDate)) {
      const dateRange = getAvailableDateRange();
      addAssistantMessage(t('dateOutOfSeason', lang, { 
        start: dateRange.seasonStart, 
        end: dateRange.seasonEnd 
      }));
      return;
    }
    
    updateCurrentPerson({ startDate });
    setChatStep(5);
    addMessage('user', `${t('startDate', lang)}: ${new Date(startDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}`);
    addAssistantMessage(t('dateSelected', lang));
  };

  const handleExtrasSelection = async (selectedExtras) => {
    updateCurrentPerson({ extras: selectedExtras });
    setChatStep(6);
    const extrasText = selectedExtras.length > 0 ? selectedExtras.join(', ') : (lang === 'de' ? 'Keine Extras' : 'No extras');
    addMessage('user', `${t('extras', lang)}: ${extrasText}`);
    addAssistantMessage(t('extrasSelected', lang));
  };

  const handleCustomerData = async (name, email) => {
    const currentPerson = getCurrentPerson();
    const ageGroup = getAgeGroup(currentPerson.age);
    const total = calculatePrice(currentPerson.category, ageGroup, currentPerson.days, currentPerson.extras);
    
    updateCurrentPerson({
      customerName: name,
      customerEmail: email,
      totalPrice: total
    });
    
    setChatStep(7);
    addMessage('user', `${t('fullName', lang)}: ${name}, ${t('email', lang)}: ${email}`);
    addAssistantMessage(t('contactComplete', lang));
  };

  const handleAddAnotherPerson = async () => {
    setPersons(prev => [...prev, {
      age: null,
      category: null,
      days: 0,
      startDate: '',
      extras: [],
      customerName: '',
      customerEmail: '',
      totalPrice: 0
    }]);
    setCurrentPersonIndex(persons.length);
    setChatStep(1);
    addMessage('user', lang === 'de' ? 'Ja, ich möchte eine weitere Person hinzufügen' : 'Yes, I want to add another person');
    addAssistantMessage(t('shopSelected', lang, { shop: selectedShop.name }));
  };


const handleProceedToPayment = () => {
  // Generate booking number here ZUERST
  const bookingNumber = 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase();
  setCurrentBookingNumber(bookingNumber);  // DANN kannst du es verwenden
  
  setChatStep(8); // Payment step
  addMessage('user', lang === 'de' ? 'Zur Zahlung fortfahren' : 'Proceed to payment');
  addAssistantMessage(lang === 'de' 
    ? '💳 Sehr gut! Lassen Sie uns die Zahlung abschließen. Ihre Buchung ist reserviert.'
    : '💳 Great! Let\'s complete the payment. Your booking is reserved.'
  );
};

  const handlePaymentSuccess = async (paymentIntent) => {
  setChatStep(9); // Confirmation step
  
  addAssistantMessage(lang === 'de'
    ? `✅ Zahlung erfolgreich! Ihre Buchung ist bestätigt. Sie erhalten in Kürze eine Email.`
    : `✅ Payment successful! Your booking is confirmed. You will receive an email shortly.`
  );
  
  // Save booking to state
  const bookingGroupId = Math.random().toString(36).substr(2, 9);
  const newBookings = persons.map(person => ({
    booking_id: Math.random().toString(36).substr(2, 9),
    booking_group_id: bookingGroupId,
    timestamp: new Date().toISOString(),
    customer_name: person.customerName,
    customer_email: person.customerEmail,
    category: person.category,
    age: person.age,
    days: person.days,
    start_date: person.startDate,
    extras: person.extras,
    total_price: person.totalPrice,
    payment_status: "Paid",
    payment_intent_id: paymentIntent.id,
    shop: selectedShop?.name || 'Unknown'
  }));
  
  setAllBookings(prev => [...newBookings, ...prev]);
  
  // Email mit PDF senden - GENAU WIE VORHER
  setTimeout(async () => {
    addAssistantMessage(lang === 'de' 
      ? '📧 Sende automatisch Ihre Buchungsbestätigung per Email...' 
      : '📧 Automatically sending your booking confirmation by email...'
    );
    
    const bookingData = {
      booking_number: currentBookingNumber,
      timestamp: new Date().toISOString()
    };
    
    try {
      // PDF mit Barcode generieren - GENAU WIE IN handleCompleteBooking
      const pdf = generateBookingPDF(bookingData, persons, selectedShop, lang);
      const pdfBase64 = pdf.output('datauristring');
      
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          persons,
          selectedShop,
          pdfBase64, // PDF mit Barcode wird mitgesendet
          lang
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setEmailSent(true);
        addAssistantMessage(`✅ ${result.message || (lang === 'de' 
          ? 'Buchungsbestätigung wurde erfolgreich versendet!' 
          : 'Booking confirmation was successfully sent!')}`);
      } else {
        throw new Error('Email send failed');
      }
    } catch (error) {
      console.error('Email error:', error);
      addAssistantMessage(lang === 'de' 
        ? '❌ Fehler beim Email-Versand. Bitte nutzen Sie den Download-Button.' 
        : '❌ Error sending email. Please use the download button.'
      );
    }
  }, 1500); // 1.5 Sekunden Verzögerung wie vorher
};

  const handleGoBack = () => {
    if (chatStep > 1) {
      setChatStep(chatStep - 1);
      addAssistantMessage(lang === 'de' ? "Kein Problem! Lassen Sie uns das nochmal machen. 😊" : "No problem! Let's do that again. 😊");
    } else if (chatStep === 1) {
      setChatStep(0);
      setSelectedShop(null);
      setIsQuestionMode(false);
      addAssistantMessage(t('chatWelcome', lang));
    }
  };

  const handleDeletePerson = (indexToDelete) => {
    if (persons.length <= 1) {
      addAssistantMessage(t('cannotDeleteLast', lang));
      return;
    }
    
    const personToDelete = persons[indexToDelete];
    const newPersons = persons.filter((_, index) => index !== indexToDelete);
    setPersons(newPersons);
    
    if (currentPersonIndex >= indexToDelete && currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1);
    }
    
    if (editingPersonIndex === indexToDelete) {
      setEditingPersonIndex(null);
    } else if (editingPersonIndex > indexToDelete) {
      setEditingPersonIndex(editingPersonIndex - 1);
    }
    
    addAssistantMessage(`✅ ${t('personDeleted', lang)}`);
  };

  // Extras Selection Component
  const ExtrasSelection = ({ onSelect, currentPerson }) => {
    const [selectedExtras, setSelectedExtras] = useState([]);
    
    const toggleExtra = (extraName) => {
      setSelectedExtras(prev => {
        if (prev.includes(extraName)) {
          return prev.filter(e => e !== extraName);
        } else {
          return [...prev, extraName];
        }
      });
    };

    const confirmSelection = () => {
      onSelect(selectedExtras);
    };

    const getAgeBasedPrice = (extraName) => {
      const ageGroup = getAgeGroup(currentPerson.age);
      const dayIndex = 0; // For "from" price
      if (EXTRAS_PRICING[extraName] && EXTRAS_PRICING[extraName][ageGroup]) {
        return EXTRAS_PRICING[extraName][ageGroup][dayIndex].toFixed(2);
      }
      return '0.00';
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {extras.map((extra) => (
            <div
              key={extra.name}
              onClick={() => toggleExtra(extra.name)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedExtras.includes(extra.name)
                  ? 'border-[#ec0008] bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{extra.icon}</div>
                <h4 className="font-semibold">{extra.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{t(`${extra.name.toLowerCase()}Desc`, lang)}</p>
                <p className="font-bold text-[#ec0008]">
                  {lang === 'de' ? 'ab' : 'from'} €{getAgeBasedPrice(extra.name)}/{t('days', lang).toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={confirmSelection}
          className="w-full bg-[#ec0008] text-white p-3 rounded-lg hover:bg-[#d00007] transition-colors"
        >
          {t('next', lang)} {selectedExtras.length > 0 && `${lang === 'de' ? 'mit' : 'with'} ${selectedExtras.join(', ')}`}
        </button>
      </div>
    );
  };

  // Start Date Selection Component
  const StartDateSelection = ({ onSelect }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const dateRange = getAvailableDateRange();
    
    const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
    };
    
    const confirmDate = () => {
      if (selectedDate) {
        onSelect(selectedDate);
      }
    };

    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-[#ec0008] mr-2" />
            <span className="font-semibold text-[#ec0008]">{t('skiSeason', lang)}</span>
          </div>
          <p className="text-sm text-gray-700">
            {t('availableFrom', lang)} <strong>{dateRange.seasonStart}</strong> {t('to', lang)} <strong>{dateRange.seasonEnd}</strong>
          </p>
        </div>
        
        <div className="space-y-3">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            {lang === 'de' ? 'Wählen Sie Ihr Startdatum:' : 'Choose your start date:'}
          </label>
          <input
            id="startDate"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={dateRange.min}
            max={dateRange.max}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent text-lg"
          />
          
          {selectedDate && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ {lang === 'de' ? 'Gewähltes Startdatum:' : 'Selected start date:'} <strong>{new Date(selectedDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</strong>
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={confirmDate}
          disabled={!selectedDate}
          className="w-full bg-[#ec0008] text-white p-3 rounded-lg hover:bg-[#d00007] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {selectedDate ? `${t('next', lang)} ${lang === 'de' ? 'mit' : 'with'} ${new Date(selectedDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}` : (lang === 'de' ? 'Bitte Datum wählen' : 'Please select date')}
        </button>
      </div>
    );
  };

  // Customer Details Form Component
  const CustomerDetailsForm = ({ onSubmit, currentPerson, onGoBack, selectedShop }) => {
    const [customerForm, setCustomerForm] = useState({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
      setIsLoading(true);
      await onSubmit(customerForm.name, customerForm.email);
      setIsLoading(false);
    };

    const ageGroup = getAgeGroup(currentPerson.age);
    const total = calculatePrice(currentPerson.category, ageGroup, currentPerson.days, currentPerson.extras);

    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">{t('contactDetails', lang)}</h3>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-700">{t('yourSelection', lang)}:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">{t('pickupLocation', lang)}:</div>
            <div className="font-medium">{selectedShop?.name}</div>
            <div className="text-gray-600">{t('category', lang)}:</div>
            <div className="font-medium">{currentPerson.category}</div>
            <div className="text-gray-600">{t('age', lang)}:</div>
            <div className="font-medium">{currentPerson.age} {lang === 'de' ? 'Jahre' : 'years'} ({t(ageGroup, lang)})</div>
            <div className="text-gray-600">{t('days', lang)}:</div>
            <div className="font-medium">{currentPerson.days}</div>
            <div className="text-gray-600">{t('startDate', lang)}:</div>
            <div className="font-medium">{currentPerson.startDate ? new Date(currentPerson.startDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : 'N/A'}</div>
            <div className="text-gray-600">{t('extras', lang)}:</div>
            <div className="font-medium">{currentPerson.extras.length > 0 ? currentPerson.extras.join(', ') : lang === 'de' ? 'Keine' : 'None'}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">{t('totalPrice', lang)}:</span>
              <span className="text-2xl font-bold text-[#ec0008]">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('fullName', lang)} *
            </label>
            <input
              id="name"
              type="text"
              placeholder={lang === 'de' ? "Max Mustermann" : "John Doe"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent"
              value={customerForm.name}
              onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('email', lang)} *
            </label>
            <input
              id="email"
              type="email"
              placeholder={lang === 'de' ? "max@beispiel.com" : "john@example.com"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent"
              value={customerForm.email}
              onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!customerForm.name || !customerForm.email || isLoading}
            className="w-full bg-[#ec0008] text-white p-4 rounded-lg hover:bg-[#d00007] disabled:opacity-50 transition-colors font-semibold"
          >
            {isLoading ? t('processing', lang) : t('next', lang)}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            * {lang === 'de' ? 'Pflichtfelder - Ihre Daten werden sicher und vertraulich behandelt' : 'Required fields - Your data will be handled securely and confidentially'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full min-h-[80vh] max-h-[90vh] bg-gray-50 p-4">
      {/* COLUMN 1: CHAT */}
      <div className="lg:w-1/3 w-full flex flex-col bg-white border border-gray-200 rounded shadow">
        {/* Chat Header */}
        <div className="bg-[#ec0008] text-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AnnaAvatar size="medium" />
              <div className="ml-3">
                <h2 className="text-lg font-bold">{t('annaAssistant', lang)}</h2>
                <p className="text-sm opacity-90">
                  {selectedShop ? selectedShop.name : 'Sport 2000 Zell am See'}
                  {isLoading && <span className="ml-2">• {lang === 'de' ? 'Denkt...' : 'Thinking...'}</span>}
                </p>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
              title={t('selectLanguage', lang)}
            >
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[70vh] lg:max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <AnnaAvatar size="small" />
                )}
                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#ec0008] text-white ml-2'
                    : 'bg-gray-100 text-gray-800 ml-3'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <AnnaAvatar size="small" />
                <div className="bg-gray-100 text-gray-800 ml-3 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{lang === 'de' ? 'Anna denkt...' : 'Anna is thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          {/* Indikator für Fragemöglichkeit während Buchung */}
          {chatStep > 0 && chatStep < 9 && (
            <div className="mb-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center">
              <HelpCircle className="w-4 h-4 mr-1" />
              {lang === 'de' 
                ? 'Tipp: Sie können jederzeit Fragen stellen, ohne die Buchung zu verlieren!' 
                : 'Tip: You can ask questions anytime without losing your booking progress!'
              }
            </div>
          )}
          
          {/* Wenn in Fragemodus während Buchung */}
          {chatMode === 'question' && savedBookingState && (
            <div className="mb-2">
              <button
                onClick={() => {
                  setChatStep(savedBookingState.step);
                  setPersons(savedBookingState.persons);
                  setCurrentPersonIndex(savedBookingState.currentPersonIndex);
                  setSelectedShop(savedBookingState.selectedShop);
                  setChatMode('booking');
                  setSavedBookingState(null);
                  addAssistantMessage(lang === 'de'
                    ? '✅ Zurück zur Buchung!'
                    : '✅ Back to booking!'
                  );
                }}
                className="bg-[#ec0008] text-white px-4 py-2 rounded-lg hover:bg-[#d00007] text-sm w-full flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {lang === 'de' ? 'Zurück zur Buchung' : 'Back to Booking'}
              </button>
            </div>
          )}
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                chatMode === 'question' && savedBookingState
                  ? (lang === 'de' ? "Stellen Sie Ihre Frage..." : "Ask your question...")
                  : (lang === 'de' ? "Schreiben Sie eine Nachricht..." : "Type a message...")
              }
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              className="bg-[#ec0008] text-white px-4 py-3 rounded-lg hover:bg-[#d00007] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {chatStep === 0 && !isQuestionMode && !isLoading && (
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setIsQuestionMode(true);
                  addMessage('user', lang === 'de' ? 'Ich habe eine Frage' : 'I have a question');
                  processUserMessage(lang === 'de' ? 'Ich habe eine Frage' : 'I have a question');
                }}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ❓ {t('askQuestion', lang)}
              </button>
              <button
                onClick={() => {
                  addMessage('user', lang === 'de' ? 'Zeige mir die Standorte' : 'Show me the locations');
                  processUserMessage(lang === 'de' ? 'Zeige mir die Standorte' : 'Show me the locations');
                }}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🏪 {t('showLocations', lang)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2: SELECTION/INTERACTION */}
      <div className="lg:w-1/3 w-full flex flex-col bg-white border border-gray-200 rounded shadow">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {chatStep === 0 && !selectedShop ? t('selectShop', lang) :
               chatStep === 1 ? t('selectAge', lang) :
               chatStep === 2 ? t('selectCategory', lang) :
               chatStep === 3 ? t('selectDays', lang) :
               chatStep === 4 ? t('selectDate', lang) :
               chatStep === 5 ? t('addExtras', lang) :
               chatStep === 6 ? t('contactDetails', lang) :
               chatStep === 7 ? t('managePersons', lang) :
               chatStep === 9 ? t('bookingConfirmedHeader', lang) :
               'Ski-Booking'}
            </h1>
            {chatStep > 0 && chatStep < 9 && (
              <button
                onClick={handleGoBack}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                {t('back', lang)}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
          {/* Step 0: Shop Selection */}
          {chatStep === 0 && !isQuestionMode && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SHOPS.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => handleShopSelection(shop)}
                    className="bg-white border-2 border-gray-200 rounded-xl flex flex-col justify-center items-center text-center break-words min-h-[180px] md:min-h-[200px] p-4 md:p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-[#ec0008] group"
                  >
                    <div className="flex flex-col flex-1 justify-center items-center text-center h-full w-full space-y-0.5">
                      <div className="mb-3 group-hover:scale-105 transition-transform">
                        <img src="/assets/Sport_2000_rgb.png" alt="Sport 2000 Logo" className="h-14 mx-auto" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-[#ec0008]">{shop.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 italic">{shop.description[lang]}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p className="flex items-center justify-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {typeof shop.address === 'string' ? shop.address : shop.address[lang]}
                        </p>
                        {shop.openingHours && <p className="font-medium">{shop.openingHours}</p>}
                      </div>
                      <div className="mt-4">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#ec0008] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {lang === 'de' ? 'Hier buchen →' : 'Book here →'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  🎿 {lang === 'de' ? 'Wählen Sie Ihren bevorzugten Standort für die Abholung' : 'Choose your preferred location for pickup'}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  📞 {lang === 'de' ? 'Alle Standorte' : 'All locations'}: +43 6767 440618 • 📧 info@ski-mobil.at
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Age Selection */}
          {chatStep === 1 && (
            <div className="max-w-2xl mx-auto">
              {selectedShop && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ {lang === 'de' ? 'Gewählter Standort:' : 'Selected location:'} <strong>{selectedShop.name}</strong>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleAgeSelection(12)}
                  className="bg-white border-2 border-gray-200 hover:border-[#ec0008] hover:shadow-lg rounded-xl flex flex-col justify-center items-center text-center break-words min-h-[180px] p-4 md:p-6 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧒</div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#ec0008]">{t('children', lang)}</h3>
                    <p className="text-gray-600 mt-2">{t('childrenDesc', lang)}</p>
                    <p className="text-sm text-[#ec0008] mt-4 font-semibold">
                      {lang === 'de' ? 'Spezielle Kinderpreise' : 'Special children\'s prices'}
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAgeSelection(16)}
                  className="bg-white border-2 border-gray-200 hover:border-[#ec0008] hover:shadow-lg rounded-xl flex flex-col justify-center items-center text-center break-words min-h-[180px] p-4 md:p-6 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧑</div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#ec0008]">{t('youth', lang)}</h3>
                    <p className="text-gray-600 mt-2">{t('youthDesc', lang)}</p>
                    <p className="text-sm text-[#ec0008] mt-4 font-semibold">
                      {lang === 'de' ? 'Vergünstigte Preise' : 'Discounted prices'}
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAgeSelection(25)}
                  className="bg-white border-2 border-gray-200 hover:border-[#ec0008] hover:shadow-lg rounded-xl flex flex-col justify-center items-center text-center break-words min-h-[180px] p-4 md:p-6 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👩‍💼</div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#ec0008]">{t('adults', lang)}</h3>
                    <p className="text-gray-600 mt-2">{t('adultsDesc', lang)}</p>
                    <p className="text-sm text-[#ec0008] mt-4 font-semibold">
                      {lang === 'de' ? 'Reguläre Preise' : 'Regular prices'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Category Selection */}
          {chatStep === 2 && (
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skiCategories.filter(cat => {
                  const currentPerson = getCurrentPerson();
                  const ageGroup = getAgeGroup(currentPerson.age);
                  return PRICING[cat.name] && PRICING[cat.name][ageGroup];
                }).map((category) => (
                  <div
                    key={category.name}
                    onClick={() => handleCategorySelection(category)}
                    className="bg-white border-2 border-gray-200 hover:border-[#ec0008] hover:shadow-lg rounded-xl flex flex-col justify-center items-center text-center break-words min-h-[180px] p-4 md:p-6 transition-all group cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.image}</div>
                      <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-[#ec0008]">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{t(`${category.name.toLowerCase()}Desc`, lang)}</p>
                      <div className="space-y-2">
                        {category.features[lang].map((feature, idx) => (
                          <p key={idx} className="text-xs text-gray-500">✓ {feature}</p>
                        ))}
                      </div>
                      <p className="text-2xl font-bold text-[#ec0008] mt-4">
                        {lang === 'de' ? 'ab' : 'from'} €{PRICING[category.name][getAgeGroup(getCurrentPerson().age)][0]}/{t('days', lang).toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Days Selection */}
          {chatStep === 3 && (
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((days) => {
                  const currentPerson = getCurrentPerson();
                  const ageGroup = getAgeGroup(currentPerson.age);
                  const dayIndex = days > 6 ? 5 : days - 1;
                  const price = PRICING[currentPerson.category][ageGroup][dayIndex];
                  
                  return (
                    <button
                      key={days}
                      onClick={() => handleDaysSelection(days)}
                      className="bg-white border-2 border-gray-200 hover:border-[#ec0008] hover:shadow-lg rounded-xl flex flex-col justify-center items-center text-center p-8 transition-all group min-h-[200px]"
                      disabled={isLoading}
                    >
                      <div className="text-3xl font-bold text-gray-800 group-hover:text-[#ec0008]">{days}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {lang === 'de' ? `Tag${days === 1 ? '' : 'e'}` : `day${days === 1 ? '' : 's'}`}
                      </div>
                      <div className="text-lg font-bold text-[#ec0008] mt-2">€{price}</div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  💡 {lang === 'de' ? 'Tipp: Je länger die Mietdauer, desto günstiger der Tagespreis!' : 'Tip: The longer the rental period, the cheaper the daily price!'}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Start Date Selection */}
          {chatStep === 4 && (
            <div className="max-w-2xl mx-auto">
              <StartDateSelection onSelect={handleStartDateSelection} />
            </div>
          )}

          {/* Step 5: Extras Selection */}
          {chatStep === 5 && (
            <div className="max-w-3xl mx-auto">
              <ExtrasSelection onSelect={handleExtrasSelection} currentPerson={getCurrentPerson()} />
            </div>
          )}

          {/* Step 6: Customer Details */}
          {chatStep === 6 && (
            <div className="max-w-2xl mx-auto">
              <CustomerDetailsForm onSubmit={handleCustomerData} currentPerson={getCurrentPerson()} onGoBack={handleGoBack} selectedShop={selectedShop} />
            </div>
          )}

          {/* Step 7: Add Another Person */}
          {chatStep === 7 && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  {lang === 'de' ? 'Möchten Sie noch eine Person hinzufügen?' : 'Would you like to add another person?'}
                </h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-4 text-gray-700">{t('bookingOverview', lang)}:</h4>
                  <div className="space-y-3">
                    {persons.map((person, index) => (
                      <div key={index} className="border-2 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-gray-800">
                              {lang === 'de' ? 'Person' : 'Person'} {index + 1}: {person.customerName}
                              <span className="ml-2 text-sm font-normal text-gray-500">({person.customerEmail})</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 space-y-1">
                              <div className="flex flex-wrap gap-4">
                                <span>📂 {person.category}</span>
                                <span>👤 {person.age} {lang === 'de' ? 'Jahre' : 'years'}</span>
                                <span>📅 {person.days} {lang === 'de' ? `Tag${person.days > 1 ? 'e' : ''}` : `day${person.days > 1 ? 's' : ''}`}</span>
                                <span>🗓️ {lang === 'de' ? 'Ab' : 'From'} {person.startDate ? new Date(person.startDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : 'N/A'}</span>
                              </div>
                              {person.extras.length > 0 && (
                                <div>🎒 {t('extras', lang)}: {person.extras.join(', ')}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#ec0008]">€{person.totalPrice.toFixed(2)}</div>
                            <div className="text-xs text-gray-500 mb-2">{t('totalPrice', lang)}</div>
                            
                            <button
                              onClick={() => handleDeletePerson(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                              title={t('delete', lang)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                  
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddAnotherPerson}
                    className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    {t('addPerson', lang)}
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="flex-1 bg-[#ec0008] text-white p-4 rounded-lg hover:bg-[#d00007] transition-colors flex items-center justify-center font-semibold"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t('toPayment', lang)} ({persons.length} {lang === 'de' ? `Person${persons.length > 1 ? 'en' : ''}` : `person${persons.length > 1 ? 's' : ''}`})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Payment */}
          {chatStep === 8 && (
            <PaymentStep
              persons={persons}
              selectedShop={selectedShop}
              bookingNumber={currentBookingNumber}
              onSuccess={handlePaymentSuccess}
              onBack={handleGoBack}
              lang={lang}
            />
          )}

          {/* Step 9: Confirmation */}
          {chatStep === 9 && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">{t('bookingSuccessful', lang)}</h2>
                  <p className="text-gray-600">{t('equipmentReserved', lang)}</p>
                </div>
                  
                {selectedShop && (
                  <div className="mb-6 p-6 bg-red-50 rounded-lg border-l-4 border-[#ec0008]">
                    <h3 className="font-bold text-gray-800 mb-3">📍 {t('pickupLocation', lang)}:</h3>
                    <div className="text-gray-700">
                      <p className="font-semibold">{selectedShop.name}</p>
                      <p>{typeof selectedShop.address === 'string' ? selectedShop.address : selectedShop.address[lang]}</p>
                      <p>📞 {selectedShop.phone}</p>
                      {selectedShop.openingHours && <p>🕒 {selectedShop.openingHours}</p>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="font-bold text-[#ec0008]">{t('bookingNumber', lang)}: {currentBookingNumber}</p>
                    </div>
                  </div>
                )}

                <div className="mb-6 space-y-3">
                  <div className="flex space-x-4">
                    <button
                      onClick={handleDownloadVoucher}
                      disabled={isGeneratingPDF}
                      className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          {t('creatingVoucher', lang)}
                        </>
                      ) : (
                        <>
                          <Printer className="w-4 h-4 mr-2" />
                          📄 {t('downloadVoucher', lang)}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleSendBookingVoucher}
                      disabled={isGeneratingPDF || emailSent}
                      className="flex-1 bg-[#ec0008] text-white p-4 rounded-lg hover:bg-[#d00007] disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {emailSent ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          📧 {t('emailSent', lang)} ✅
                        </>
                      ) : isGeneratingPDF ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          {t('sendingEmail', lang)}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          📧 {t('sendEmail', lang)}
                        </>
                      )}
                    </button>
                  </div>
                  
                  {emailSent && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                      ✅ {lang === 'de' ? `Buchungsbestätigung wurde erfolgreich an ${persons[0]?.customerEmail} gesendet!` : `Booking confirmation successfully sent to ${persons[0]?.customerEmail}!`}
                    </div>
                  )}
                </div>
                  
                <div className="text-center">
                  <button
                    onClick={() => {
                      setChatStep(0);
                      setSelectedShop(null);
                      setIsQuestionMode(false);
                      setEmailSent(false);
                      setCurrentBookingNumber('');
                      setPersons([{
                        age: null,
                        category: null,
                        days: 0,
                        startDate: '',
                        extras: [],
                        customerName: '',
                        customerEmail: '',
                        totalPrice: 0
                      }]);
                      setCurrentPersonIndex(0);
                      addMessage('assistant', t('chatWelcome', lang));
                    }}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg inline-flex items-center"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    {t('newBooking', lang)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 3: BOOKING OVERVIEW */}
      <div className="lg:w-1/3 w-full flex flex-col bg-white border border-gray-200 rounded shadow">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('bookingOverview', lang)}
            </h2>
            <button
              onClick={() => setCurrentView('admin')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
            >
              <Settings className="w-4 h-4 mr-1" />
              {t('admin', lang)}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 relative">
          {selectedShop && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#ec0008]" />
                {lang === 'de' ? 'Ausgewählter Shop' : 'Selected Shop'}
              </h3>
              <p className="text-sm font-medium">{selectedShop.name}</p>
              <p className="text-xs text-gray-600">{typeof selectedShop.address === 'string' ? selectedShop.address : selectedShop.address[lang]}</p>
              {selectedShop.openingHours && (
                <p className="text-xs text-gray-600 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {selectedShop.openingHours}
                </p>
              )}
            </div>
          )}

          {persons.length > 0 && persons[0].customerName && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Users className="w-4 h-4 mr-2 text-[#ec0008]" />
                {t('persons', lang)} ({persons.length})
              </h3>
              
              {persons.map((person, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {lang === 'de' ? 'Person' : 'Person'} {index + 1}: {person.customerName}
                    </h4>
                    {currentPersonIndex === index && chatStep < 7 && (
                      <span className="text-xs bg-[#ec0008] text-white px-2 py-1 rounded">
                        {lang === 'de' ? 'Aktiv' : 'Active'}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    {person.age && <p>• {t('age', lang)}: {person.age} {lang === 'de' ? 'Jahre' : 'years'}</p>}
                    {person.category && <p>• {t('category', lang)}: {person.category}</p>}
                    {person.days > 0 && <p>• {lang === 'de' ? 'Dauer' : 'Duration'}: {person.days} {lang === 'de' ? `Tag${person.days > 1 ? 'e' : ''}` : `day${person.days > 1 ? 's' : ''}`}</p>}
                    {person.startDate && <p>• Start: {new Date(person.startDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</p>}
                    {person.extras.length > 0 && <p>• {t('extras', lang)}: {person.extras.join(', ')}</p>}
                    {person.customerEmail && <p>• {t('email', lang)}: {person.customerEmail}</p>}
                  </div>
                  
                  {person.totalPrice > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-bold text-[#ec0008] text-lg">€{person.totalPrice.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Total Amount */}
              <div className="mt-6 p-4 bg-[#ec0008] text-white rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('totalAmount', lang)}:</span>
                  <span className="text-2xl font-bold">
                    €{persons.reduce((sum, person) => sum + person.totalPrice, 0).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Status Info */}
              {chatStep === 9 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {lang === 'de' ? 'Buchung bestätigt & bezahlt' : 'Booking confirmed & paid'}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {persons.length === 1 && !persons[0].customerName && (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('noBookingsYet', lang)}</p>
              <p className="text-sm text-gray-400 mt-2">{t('selectShopToStart', lang)}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 text-xs text-gray-600">
            <p className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              +43 6767 440618
            </p>
            <p className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              info@ski-mobil.at
            </p>
            <p className="flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Sport 2000 Zell am See
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== ADMIN DASHBOARD COMPONENT ==========
const AdminDashboard = ({ lang, allBookings, adminLoggedIn, setAdminLoggedIn, setCurrentView }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [filter, setFilter] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const handleLogin = () => {
    if (credentials.username === 'admin' && credentials.password === 'reitsamer2025') {
      setAdminLoggedIn(true);
    } else {
      alert(lang === 'de' ? 'Ungültige Anmeldedaten' : 'Invalid credentials');
    }
  };

  const groupBookings = (bookings) => {
    const groups = {};
    bookings.forEach(booking => {
      const groupId = booking.booking_group_id || booking.booking_id;
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(booking);
    });
    
    return Object.values(groups).map(group => {
      const sortedGroup = group.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return {
        group_id: sortedGroup[0].booking_group_id || sortedGroup[0].booking_id,
        main_customer: sortedGroup[0],
        all_persons: sortedGroup,
        total_persons: sortedGroup.length,
        total_amount: sortedGroup.reduce((sum, booking) => sum + booking.total_price, 0),
        timestamp: sortedGroup[0].timestamp,
        shop: sortedGroup[0].shop
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const bookingGroups = groupBookings(allBookings);
  
  const filteredGroups = bookingGroups.filter(group =>
    group.main_customer.customer_name.toLowerCase().includes(filter.toLowerCase()) ||
    group.main_customer.customer_email.toLowerCase().includes(filter.toLowerCase()) ||
    group.main_customer.category.toLowerCase().includes(filter.toLowerCase()) ||
    (group.shop && group.shop.toLowerCase().includes(filter.toLowerCase()))
  );

  const totalRevenue = bookingGroups.reduce((sum, group) => sum + group.total_amount, 0);
  const totalPersons = allBookings.length;
  const avgPersonsPerBooking = bookingGroups.length > 0 ? (totalPersons / bookingGroups.length) : 0;
  const paidGroups = bookingGroups.filter(group => 
    group.all_persons.every(person => person.payment_status === 'Paid')
  ).length;

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ec0008] to-[#a50006] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 mx-auto text-[#ec0008] mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{t('adminLogin', lang)}</h2>
            <p className="text-gray-600">Sport 2000 Anna Dashboard</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('username', lang)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            />
            <input
              type="password"
              placeholder={t('password', lang)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-[#ec0008] text-white p-3 rounded-lg hover:bg-[#d00007] transition-colors"
            >
              {t('login', lang)}
            </button>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentView('chat')}
              className="text-[#ec0008] hover:text-[#d00007] text-sm"
            >
              ← {t('backToChat', lang)}
            </button>
          </div>
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Demo {lang === 'de' ? 'Anmeldedaten' : 'Credentials'}:</strong><br />
            {t('username', lang)}: admin<br />
            {t('password', lang)}: reitsamer2025
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <AnnaAvatar size="medium" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">{t('bookingDashboard', lang)}</h1>
                <p className="text-sm text-gray-600">Sport 2000 Zell am See</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('chat')}
                className="bg-[#ec0008] text-white px-4 py-2 rounded-lg hover:bg-[#d00007] transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2 inline" />
                {t('viewChat', lang)}
              </button>
              <button
                onClick={() => setAdminLoggedIn(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2 inline" />
                {t('logout', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#ec0008]">
            <div className="flex items-center">
              <Users className="w-10 h-10 text-[#ec0008] mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{t('bookingGroups', lang)}</p>
                <p className="text-3xl font-bold text-gray-900">{bookingGroups.length}</p>
                <p className="text-xs text-gray-600">{totalPersons} {t('persons', lang).toLowerCase()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Euro className="w-10 h-10 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wider">{t('totalRevenue', lang)}</p>
                <p className="text-3xl font-bold text-green-900">€{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Calendar className="w-10 h-10 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">{t('avgPersonsPerBooking', lang)}</p>
                <p className="text-3xl font-bold text-purple-900">{avgPersonsPerBooking.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <CheckCircle className="w-10 h-10 text-orange-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-orange-600 uppercase tracking-wider">{t('paid', lang)}</p>
                <p className="text-3xl font-bold text-orange-900">{paidGroups}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Buttons für Finanzamt */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-[#ec0008]" />
            {lang === 'de' ? 'Daten-Export (Finanzamt)' : 'Data Export (Tax Office)'}
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => BookingBackup.exportAsJSON(allBookings)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {lang === 'de' ? 'Als JSON exportieren' : 'Export as JSON'}
            </button>
            <button
              onClick={() => BookingBackup.exportAsCSV(allBookings)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              {lang === 'de' ? 'Als CSV exportieren (Excel)' : 'Export as CSV (Excel)'}
            </button>
            <button
              onClick={() => BookingBackup.saveBookings(allBookings)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {lang === 'de' ? 'Backup speichern' : 'Save Backup'}
            </button>
            <div className="ml-auto text-sm text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              {lang === 'de' 
                ? `Automatisches Backup aktiv (alle 5 Min.)` 
                : `Auto-backup active (every 5 min.)`
              }
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('allBookings', lang)} ({filteredGroups.length} {t('groups', lang)})
              </h2>
              <input
                type="text"
                placeholder={t('search', lang)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec0008] focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <div key={group.group_id} className="hover:bg-gray-50 transition-colors">
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleGroup(group.group_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {expandedGroups.has(group.group_id) ? 
                          <div className="w-6 h-6 rounded-full bg-[#ec0008] flex items-center justify-center">
                            <span className="text-white text-sm">−</span>
                          </div> :
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-sm">+</span>
                          </div>
                        }
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-6">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {group.main_customer.customer_name}
                              {group.total_persons > 1 && 
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ec0008] text-white">
                                  +{group.total_persons - 1} {lang === 'de' ? 'weitere' : 'more'}
                                </span>
                              }
                            </div>
                            <div className="text-sm text-gray-500">{group.main_customer.customer_email}</div>
                          </div>
                          
                          <div className="text-sm text-gray-900">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {group.shop}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-900">
                            {new Date(group.timestamp).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}
                          </div>
                          
                          <div className="text-sm text-gray-900">
                            {group.main_customer.start_date ? 
                              new Date(group.main_customer.start_date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : '—'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">€{group.total_amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{group.total_persons} {lang === 'de' ? `Person${group.total_persons > 1 ? 'en' : ''}` : `person${group.total_persons > 1 ? 's' : ''}`}</div>
                      </div>
                      
                      <div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          group.all_persons.every(p => p.payment_status === 'Paid')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {group.all_persons.every(p => p.payment_status === 'Paid') ? t('paid', lang) : t('pending', lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedGroups.has(group.group_id) && (
                  <div className="px-6 pb-6 bg-gray-50">
                    <div className="border rounded-lg bg-white">
                      <div className="px-4 py-3 bg-gray-100 border-b rounded-t-lg">
                        <h4 className="text-sm font-semibold text-gray-800">
                          {t('bookingDetails', lang)} - {group.total_persons} {lang === 'de' ? `Person${group.total_persons > 1 ? 'en' : ''}` : `person${group.total_persons > 1 ? 's' : ''}`}
                        </h4>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {group.all_persons.map((person, index) => (
                          <div key={person.booking_id} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {index === 0 ? '👑 ' : '👤 '}{person.customer_name}
                                </div>
                                <div className="text-xs text-gray-500">{person.customer_email}</div>
                              </div>
                              
                              <div className="text-sm text-gray-900">
                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {person.category}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-900">{person.age} {lang === 'de' ? 'Jahre' : 'years'}</div>
                              
                              <div className="text-sm text-gray-900">{person.days} {lang === 'de' ? `Tag${person.days > 1 ? 'e' : ''}` : `day${person.days > 1 ? 's' : ''}`}</div>
                              
                              <div className="text-sm text-gray-900">
                                {person.extras.length > 0 ? person.extras.join(', ') : '—'}
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">€{person.total_price.toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noBookingsFound', lang)}</h3>
              <p className="text-gray-500">
                {filter ? (lang === 'de' ? 'Versuchen Sie andere Suchbegriffe.' : 'Try different search terms.') : (lang === 'de' ? 'Es wurden noch keine Buchungen gemacht.' : 'No bookings have been made yet.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== MAIN APP COMPONENT ==========
export default function App() {
  const [currentView, setCurrentView] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('de');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [avatarVisible, setAvatarVisible] = useState(true);
  const [allBookings, setAllBookings] = useState([
    {
      booking_id: "550e8400-e29b-41d4-a716",
      booking_group_id: "grp001",
      timestamp: "2025-01-15T14:30:00.000Z",
      customer_name: "Max Mustermann",
      customer_email: "max@example.com",
      category: "Premium",
      age: 28,
      days: 3,
      start_date: "2025-01-20",
      extras: ["Boots", "Helmet"],
      total_price: 180.00,
      payment_status: "Paid",
      shop: "Sport2000 Schmitten"
    },
    {
      booking_id: "770g0622-g4bd-63f6-c938",
      booking_group_id: "grp001",
      timestamp: "2025-01-15T14:30:00.000Z",
      customer_name: "Anna Mustermann",
      customer_email: "anna@example.com",
      category: "Premium",
      age: 25,
      days: 3,
      start_date: "2025-01-20",
      extras: ["Boots"],
      total_price: 155.00,
      payment_status: "Paid",
      shop: "Sport2000 Schmitten"
    }
  ]);

  const skiCategories = [
    {
      name: 'Platinum',
      image: '⭐️⭐️⭐️⭐️⭐️⭐️',
      description: 'Premium Skis für fortgeschrittene Skifahrer',
      features: {
        de: ['High-end Ausrüstung', 'Neueste Modelle', 'Professionelle Qualität'],
        en: ['High-end equipment', 'Latest models', 'Professional quality']
      }
    },
    {
      name: 'Premium',
      image: '⭐️⭐️⭐️⭐️⭐️',
      description: 'Qualitäts-Skis für Fortgeschrittene',
      features: {
        de: ['Qualitäts-Ausrüstung', 'Aktuelle Modelle', 'Gute Performance'],
        en: ['Quality equipment', 'Current models', 'Good performance']
      }
    },
    {
      name: 'Economy',
      image: '⭐️⭐️⭐️⭐️',
      description: 'Perfekt für Anfänger und Gelegenheitsskifahrer',
      features: {
        de: ['Gute Qualität', 'Anfängerfreundlich', 'Erschwinglich'],
        en: ['Good quality', 'Beginner-friendly', 'Affordable']
      }
    },
    {
      name: 'Snowboard',
      image: '🏂',
      description: 'Snowboards für alle Könnerstufen',
      features: {
        de: ['All-Mountain Boards', 'Verschiedene Größen', 'Komplettes Setup'],
        en: ['All-Mountain boards', 'Various sizes', 'Complete setup']
      }
    }
  ];

  const extras = [
    { name: 'Boots', icon: '👢', description: 'Professional ski/snowboard boots' },
    { name: 'Helmet', icon: '⛑️', description: 'Safety helmet' },
    { name: 'Insurance', icon: '☂️', description: 'Equipment insurance' }
  ];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setCurrentView('chat');
  };

  const renderCurrentView = () => {
    if (currentView === 'language') {
      return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
    }
    
    if (currentView === 'admin') {
      return (
        <AdminDashboard
          lang={selectedLanguage}
          allBookings={allBookings}
          adminLoggedIn={adminLoggedIn}
          setAdminLoggedIn={setAdminLoggedIn}
          setCurrentView={setCurrentView}
        />
      );
    }

    return (
      <ChatInterface
        lang={selectedLanguage}
        setLang={setSelectedLanguage}
        skiCategories={skiCategories}
        extras={extras}
        allBookings={allBookings}
        setAllBookings={setAllBookings}
        setCurrentView={setCurrentView}
      />
    );
  };

  return (
    <>
      {renderCurrentView()}
      {currentView !== 'language' && (
        <AnimatedAnnaAvatar isVisible={avatarVisible} onToggle={() => setAvatarVisible(!avatarVisible)} lang={selectedLanguage} mouthPosition={43} />
      )}
    </>
  );
}