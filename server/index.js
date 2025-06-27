import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { 
  createPaymentIntent, 
  handleStripeWebhook, 
  checkPaymentStatus,
  createRefund 
} from './stripe-handler.js';

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// __dirname nachbauen (weil ES6 module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();  // MUSS VORHER STEHEN

// statische Dateien aus dist ausliefern
app.use(express.static(path.join(__dirname, "../dist")));

// für SPA-Fallback (React-Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// WICHTIG: Middleware VOR den Routes definieren
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

// Email Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.world4you.com',
  port: 587,
  secure: false,
  auth: {
    user: 'booking@sport2000-zellamsee.at',
    pass: 'Skimobil101'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test die Email-Verbindung beim Start
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email Server Verbindung fehlgeschlagen:', error);
  } else {
    console.log('✅ Email Server ist bereit');
  }
});

// Email Templates für beide Sprachen
const emailTemplates = {
  de: {
    subject: 'Buchungsbestätigung {bookingNumber} - Sport2000 Zell am See',
    greeting: 'Sehr geehrte/r',
    thanks: 'vielen Dank für Ihre Buchung bei Sport 2000 Zell am See! Wir freuen uns, Sie bald bei uns begrüßen zu dürfen.',
    bookingConfirmation: 'Ihre Buchungsbestätigung',
    bookingNumber: 'Buchungsnummer',
    date: 'Datum',
    pickupLocation: 'Abholungsort',
    phone: 'Tel',
    openingHours: 'Öffnungszeiten',
    bookingDetails: 'Ihre Buchungsdetails',
    name: 'Name',
    category: 'Kategorie',
    days: 'Tage',
    start: 'Start',
    extras: 'Extras',
    price: 'Preis',
    day: 'Tag',
    totalAmount: 'GESAMTSUMME',
    yourVoucher: 'Ihr Voucher',
    printVoucher: 'Bitte drucken Sie diesen Voucher aus oder zeigen Sie ihn bei der Abholung am Smartphone vor.',
    voucherAttached: 'Ihren Voucher finden Sie als PDF im Anhang dieser Email.',
    importantNotes: 'Wichtige Hinweise',
    bringID: 'Bitte bringen Sie einen gültigen Ausweis zur Abholung mit',
    pickupFromOpening: 'Abholung ab Öffnung möglich',
    returnBefore: 'Rückgabe bis 1 Stunde vor Geschäftsschluss',
    questionsCall: 'Bei Fragen erreichen Sie uns unter',
    haveFun: 'Wir wünschen Ihnen einen wunderbaren Aufenthalt und viel Spaß auf der Piste!',
    regards: 'Mit sportlichen Grüßen',
    yourTeam: 'Ihr Sport2000 Team',
    footer: 'Diese Email wurde automatisch generiert.'
  },
  en: {
    subject: 'Booking Confirmation {bookingNumber} - Sport2000 Zell am See',
    greeting: 'Dear',
    thanks: 'thank you for your booking at Sport 2000 Zell am See! We look forward to welcoming you soon.',
    bookingConfirmation: 'Your Booking Confirmation',
    bookingNumber: 'Booking Number',
    date: 'Date',
    pickupLocation: 'Pickup Location',
    phone: 'Phone',
    openingHours: 'Opening Hours',
    bookingDetails: 'Your Booking Details',
    name: 'Name',
    category: 'Category',
    days: 'Days',
    start: 'Start',
    extras: 'Extras',
    price: 'Price',
    day: 'day',
    totalAmount: 'TOTAL AMOUNT',
    yourVoucher: 'Your Voucher',
    printVoucher: 'Please print this voucher or show it on your smartphone when picking up.',
    voucherAttached: 'Your voucher is attached as a PDF to this email.',
    importantNotes: 'Important Notes',
    bringID: 'Please bring valid ID for pickup',
    pickupFromOpening: 'Pickup available from opening',
    returnBefore: 'Return up to 1 hour before closing',
    questionsCall: 'For questions call us at',
    haveFun: 'We wish you a wonderful stay and lots of fun on the slopes!',
    regards: 'Best regards',
    yourTeam: 'Your Sport2000 Team',
    footer: 'This email was automatically generated.'
  }
};

// System prompt for GPT
const getSystemPrompt = (lang) => {
  const prompts = {
    de: `Du bist Anna, die freundliche digitale Assistentin von Sport 2000 Zell am See. 
Du hilfst Kunden bei der Buchung von Skiausrüstung und beantwortest Fragen rund um:
- Skiverleih und Preise
- Die 4 Standorte (Schmitten, Zell am See, Areit, Amiamo Hotel)
- Öffnungszeiten (08:30 - 12:00 / 14:00 - 17:00)
- Kategorien: Economy, Premium, Platinum, Snowboard
- Extras: Schuhe, Helm, Versicherung
- Skigebiete in der Region

Sei immer freundlich, hilfsbereit und professionell. Verwende Emojis sparsam aber passend.
Antworte kurz und prägnant, aber vollständig. Bei Buchungsfragen leite geschickt zum Buchungsprozess über.`,
    
    en: `You are Anna, the friendly digital assistant from Sport 2000 Zell am See.
You help customers book ski equipment and answer questions about:
- Ski rental and prices
- The 4 locations (Schmitten, Zell am See, Areit, Amiamo Hotel)
- Opening hours (08:30 - 12:00 / 14:00 - 17:00)
- Categories: Economy, Premium, Platinum, Snowboard
- Extras: Boots, Helmet, Insurance
- Ski areas in the region

Always be friendly, helpful and professional. Use emojis sparingly but appropriately.
Answer concisely but completely. For booking questions, skillfully guide to the booking process.`
  };
  
  return prompts[lang] || prompts.de;
};

// GPT Chat Endpoint
app.post('/api/chat/gpt', async (req, res) => {
  const { message, chatHistory = [], lang = 'de', context = {} } = req.body;
  
  try {
    console.log('🤖 GPT Chat Request:', { message, lang });
    
    // Prepare messages for GPT
    const messages = [
      { role: 'system', content: getSystemPrompt(lang) }
    ];
    
    // Add recent chat history (last 5 messages)
    chatHistory.slice(-5).forEach(msg => {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.message
      });
    });
    
    // Add current message
    messages.push({ role: 'user', content: message });
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    const response = completion.choices[0].message.content;
    
    console.log('✅ GPT Response:', response);
    
    res.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ GPT Error:', error);
    const errorMessage = lang === 'en' 
      ? 'Sorry, I had trouble understanding that. Could you please try again?'
      : 'Entschuldigung, ich hatte Probleme das zu verstehen. Könnten Sie es bitte nochmal versuchen?';
    
    res.json({
      success: true,
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// ===== AZURE TTS ENDPOINT (NUR NOCH DIESER!) =====
app.post('/api/tts/azure', async (req, res) => {
  try {
    const { text, lang = 'de' } = req.body;
    
    console.log('🎙️ Azure TTS Request:', { textLength: text.length, lang });
    
    // Azure Credentials (aus .env)
    const azureKey = process.env.AZURE_SPEECH_KEY;
    const azureRegion = process.env.AZURE_REGION || 'westeurope';
    
    if (!azureKey) {
      throw new Error('AZURE_SPEECH_KEY fehlt in .env Datei!');
    }
    
    // Voice Names für Azure - NUR NOCH DIESE STIMMEN
    const voiceNames = {
      de: 'de-AT-IngridNeural',      // 🇦🇹 ÖSTERREICHISCH! Perfekt für Zell am See!
      en: 'en-US-AriaNeural'         // 🇺🇸 Professionell & freundlich
    };
    
    const voiceName = voiceNames[lang] || voiceNames.de;
    
    console.log(`🎯 Verwende Azure Stimme: ${voiceName}`);
    
    // SSML für bessere Kontrolle der Sprache
    const ssml = `
      <speak version='1.0' xml:lang='${lang === 'de' ? 'de-AT' : 'en-US'}'>
        <voice name='${voiceName}'>
          <prosody rate="0.95" pitch="+3%" volume="+5%">
            <emphasis level="moderate">
              ${text}
            </emphasis>
          </prosody>
        </voice>
      </speak>
    `;
    
    // Azure TTS API Call
    const response = await fetch(`https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3', // Hohe Qualität
        'User-Agent': 'Sport2000-Anna-Assistant'
      },
      body: ssml
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Azure TTS Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Azure TTS error: ${response.status} - ${errorText}`);
    }
    
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    console.log(`✅ Azure TTS Success - Audio generiert (${audioBuffer.byteLength} bytes)`);
    
    res.json({
      success: true,
      audio: `data:audio/mpeg;base64,${base64Audio}`,
      provider: 'azure',
      voice: voiceName,
      quality: '24khz-96kbit'
    });
    
  } catch (error) {
    console.error('❌ Azure TTS Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      provider: 'azure'
    });
  }
});

// Email-Versand Endpoint
app.post('/api/send-booking-email', async (req, res) => {
  console.log('📧 Email-Anfrage erhalten');
  
  try {
    const { bookingData, persons, selectedShop, voucherHTML, pdfBase64, lang = 'de' } = req.body;
    
    // Get the appropriate template
    const t = emailTemplates[lang] || emailTemplates.de;
    
    // Debug-Ausgabe
    console.log('Buchungsdaten:', {
      bookingNumber: bookingData?.booking_number,
      personsCount: persons?.length,
      shop: selectedShop?.name,
      hasHTML: !!voucherHTML,
      hasPDF: !!pdfBase64,
      language: lang
    });
    
    // Prüfe ob mindestens HTML oder PDF vorhanden ist
    if (!voucherHTML && !pdfBase64) {
      throw new Error(lang === 'en' ? 'Neither HTML nor PDF data available' : 'Weder HTML noch PDF Daten vorhanden');
    }
    
    // Email HTML erstellen
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
          }
          .header { 
            background-color: #ec0008; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 18px;
          }
          .content { 
            padding: 30px 20px; 
          }
          .booking-info {
            background-color: #f9f9f9;
            border-left: 4px solid #ec0008;
            padding: 15px;
            margin: 20px 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
          }
          th { 
            background-color: #ec0008; 
            color: white; 
            font-weight: bold;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          .total {
            background-color: #22c55e;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            border-radius: 5px;
            margin: 20px 0;
          }
          .voucher { 
            border: 2px solid #ec0008; 
            padding: 20px; 
            margin: 20px 0; 
            background-color: #fff8f0;
            border-radius: 5px;
          }
          .footer {
            background-color: #333;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>SPORT 2000 ZELL AM SEE</h1>
            <p>${t.bookingConfirmation}</p>
          </div>
          
          <div class="content">
            <p>${t.greeting} <strong>${persons[0].customerName}</strong>,</p>
            <p>${t.thanks}</p>
            
            <div class="booking-info">
              <h3 style="margin-top: 0; color: #ec0008;">${t.bookingNumber}: ${bookingData.booking_number}</h3>
              <p style="margin: 5px 0;">${t.date}: ${new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</p>
            </div>
            
            <h3>📍 ${t.pickupLocation}:</h3>
            <div class="booking-info">
              <strong>${selectedShop.name}</strong><br>
              ${typeof selectedShop.address === 'string' ? selectedShop.address : (selectedShop.address[lang] || selectedShop.address)}<br>
              📞 ${t.phone}: ${selectedShop.phone}<br>
              ${selectedShop.openingHours ? `🕒 ${t.openingHours}: ${selectedShop.openingHours}` : ''}
            </div>
            
            <h3>🎿 ${t.bookingDetails}:</h3>
            <table>
              <tr>
                <th>${t.name}</th>
                <th>${t.category}</th>
                <th>${t.days}</th>
                <th>${t.start}</th>
                <th>${t.extras}</th>
                <th>${t.price}</th>
              </tr>
              ${persons.map(person => `
                <tr>
                  <td><strong>${person.customerName}</strong></td>
                  <td>${person.category}</td>
                  <td>${person.days} ${lang === 'de' ? `Tag${person.days > 1 ? 'e' : ''}` : `${t.day}${person.days > 1 ? 's' : ''}`}</td>
                  <td>${person.startDate ? new Date(person.startDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : '-'}</td>
                  <td>${person.extras && person.extras.length > 0 ? person.extras.join(', ') : '-'}</td>
                  <td><strong>€${person.totalPrice.toFixed(2)}</strong></td>
                </tr>
              `).join('')}
            </table>
            
            <div class="total">
              ${t.totalAmount}: €${persons.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2)}
            </div>
            
            ${voucherHTML && !pdfBase64 ? `
              <div class="voucher">
                <h3 style="color: #ec0008; margin-top: 0;">${t.yourVoucher}:</h3>
                <p>${t.printVoucher}</p>
              </div>
            ` : ''}
            
            ${pdfBase64 ? `<p><strong>📎 ${t.voucherAttached}</strong></p>` : ''}
            
            <h3>ℹ️ ${t.importantNotes}:</h3>
            <ul>
              <li>${t.bringID}</li>
              <li>${t.pickupFromOpening}</li>
              <li>${t.returnBefore}</li>
              <li>${t.questionsCall} ${selectedShop.phone}</li>
            </ul>
            
            <p>${t.haveFun}</p>
            
            <p>${t.regards},<br>
            <strong>${t.yourTeam}</strong></p>
          </div>
          
          <div class="footer">
            Sport 2000 Zell am See | booking@sport2000-zellamsee.at | +43 6767 440618<br>
            ${t.footer}
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Email-Optionen erstellen
    const mailOptions = {
      from: '"Sport2000 Zell am See" <booking@sport2000-zellamsee.at>',
      to: persons[0].customerEmail,
      cc: 'booking@sport2000-zellamsee.at',
      subject: t.subject.replace('{bookingNumber}', bookingData.booking_number),
      html: emailHtml
    };
    
    // NUR wenn PDF vorhanden ist, als Anhang hinzufügen
    if (pdfBase64) {
      try {
        const base64Data = pdfBase64.split(',')[1] || pdfBase64;
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        
        mailOptions.attachments = [{
          filename: `Voucher_${bookingData.booking_number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }];
        
        console.log('📎 PDF-Anhang hinzugefügt');
      } catch (pdfError) {
        console.error('⚠️ Fehler beim PDF-Anhang:', pdfError.message);
        // Trotzdem Email senden, auch wenn PDF fehlschlägt
      }
    }
    
    console.log('📤 Sende Email an:', persons[0].customerEmail);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email erfolgreich gesendet:', info.messageId);
    
    const successMessage = lang === 'en' 
      ? 'Booking confirmation was successfully sent!' 
      : 'Buchungsbestätigung wurde erfolgreich versendet!';
    
    res.json({
      success: true,
      message: successMessage,
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('❌ Email-Fehler:', error.message);
    console.error('Stack:', error.stack);
    
    const errorMessage = lang === 'en'
      ? `Email send failed: ${error.message}`
      : `Email-Versand fehlgeschlagen: ${error.message}`;
    
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Health Check - Nur Azure
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'Anna Ski Assistant - Azure Edition',
    timestamp: new Date().toISOString(),
    openai: !!process.env.OPENAI_API_KEY,
    azure: {
      configured: !!process.env.AZURE_SPEECH_KEY,
      region: process.env.AZURE_REGION || 'westeurope',
      voices: {
        de: 'de-AT-IngridNeural (Österreichisch 🇦🇹)',
        en: 'en-US-AriaNeural (Professional 🇺🇸)'
      }
    },
    tts: {
      primary: 'azure',
      fallback: 'browser',
      quality: '24khz-96kbit',
      cost: 'FREE (500k chars/month)'
    }
  });
});

app.post('/api/create-payment-intent', createPaymentIntent);
app.post('/api/stripe-webhook', handleStripeWebhook);
app.get('/api/payment-status/:paymentIntentId', checkPaymentStatus);
app.post('/api/create-refund', createRefund);

// Root API Info
app.get('/api', (req, res) => {
  res.json({
    service: 'Anna Ski Assistant API - Azure Edition',
    version: '2.1.0',
    endpoints: {
      chat: '/api/chat/gpt',
      email: '/api/send-booking-email',
      health: '/api/health',
      tts: {
        azure: '/api/tts/azure (ONLY SERVICE)'
      }
    },
    note: 'Streamlined for Azure TTS only - No ElevenLabs, No D-ID'
  });
});

// Server starten
app.listen(PORT, () => {
  console.log('\n🎿 ===== ANNA SKI ASSISTANT - AZURE EDITION =====');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🤖 GPT Chat API: http://localhost:${PORT}/api/chat/gpt`);
  console.log(`🎙️ Azure TTS (ONLY): http://localhost:${PORT}/api/tts/azure`);
  console.log(`   🇦🇹 Deutsch: de-AT-IngridNeural (Österreichisch)`);
  console.log(`   🇺🇸 English: en-US-AriaNeural (Professional)`);
  console.log(`📧 Email API: http://localhost:${PORT}/api/send-booking-email`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💰 Cost: FREE (500,000 chars/month)`);
  console.log(`✅ Server READY - Streamlined Azure-Only`);
  console.log('===============================================\n');
});