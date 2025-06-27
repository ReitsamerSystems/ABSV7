import nodemailer from 'nodemailer';
import { generateBookingPDF } from '../src/utils/pdfGenerator.js';

// Email Transporter (wiederverwendbar)
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

// Email Templates
const emailTemplates = {
  de: {
    subject: 'Zahlungsbestätigung & Buchung {bookingNumber} - Sport2000 Zell am See',
    paymentReceived: 'Ihre Zahlung wurde erfolgreich empfangen!',
    paymentAmount: 'Bezahlter Betrag',
    paymentId: 'Zahlungs-ID',
    // ... rest of German templates
  },
  en: {
    subject: 'Payment Confirmation & Booking {bookingNumber} - Sport2000 Zell am See',
    paymentReceived: 'Your payment has been successfully received!',
    paymentAmount: 'Amount paid',
    paymentId: 'Payment ID',
    // ... rest of English templates
  }
};

// Booking Confirmation mit Payment Info senden
export const sendBookingConfirmation = async ({ bookingData, persons, selectedShop, lang, paymentIntentId }) => {
  try {
    const t = emailTemplates[lang] || emailTemplates.de;
    
    console.log('📧 Sending payment confirmation for:', bookingData.booking_number);
    
    // PDF mit Barcode generieren
    const pdf = generateBookingPDF(bookingData, persons, selectedShop, lang);
    const pdfBase64 = pdf.output('datauristring');
    const base64Data = pdfBase64.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    // Email HTML mit Payment Info
    const emailHtml = generatePaymentEmailHTML({
      bookingData,
      persons,
      selectedShop,
      lang,
      paymentIntentId,
      totalAmount: persons.reduce((sum, p) => sum + p.totalPrice, 0)
    });
    
    const mailOptions = {
      from: '"Sport2000 Zell am See" <booking@sport2000-zellamsee.at>',
      to: persons[0].customerEmail,
      cc: 'booking@sport2000-zellamsee.at',
      subject: t.subject.replace('{bookingNumber}', bookingData.booking_number),
      html: emailHtml,
      attachments: [{
        filename: `Voucher_${bookingData.booking_number}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Payment confirmation email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};

// Generate Payment Email HTML
function generatePaymentEmailHTML({ bookingData, persons, selectedShop, lang, paymentIntentId, totalAmount }) {
  const t = emailTemplates[lang] || emailTemplates.de;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        /* Existing styles from your email template */
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #ec0008; color: white; padding: 30px 20px; text-align: center; }
        .payment-success { background-color: #22c55e; color: white; padding: 20px; text-align: center; margin: 20px 0; }
        /* ... more styles ... */
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>SPORT 2000 ZELL AM SEE</h1>
          <p>${t.subject.replace('{bookingNumber}', bookingData.booking_number)}</p>
        </div>
        
        <div class="payment-success">
          <h2 style="margin: 0;">✅ ${t.paymentReceived}</h2>
          <p style="margin: 10px 0 0 0; font-size: 24px;">
            ${t.paymentAmount}: €${totalAmount.toFixed(2)}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
            ${t.paymentId}: ${paymentIntentId}
          </p>
        </div>
        
        <!-- Rest of your existing email template -->
        <!-- Booking details, pickup location, etc. -->
        
      </div>
    </body>
    </html>
  `;
}