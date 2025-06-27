import Stripe from 'stripe';
import { sendBookingConfirmation } from './payment-utils.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Debug: Check if key is loaded
console.log('🔑 Checking Stripe configuration...');
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env!');
  console.error('Make sure your .env file is in the root directory and contains STRIPE_SECRET_KEY=sk_test_...');
} else {
  console.log('✅ Stripe Secret Key found:', stripeKey.substring(0, 20) + '...');
}

// Stripe initialisieren
const stripe = new Stripe(stripeKey || 'sk_test_dummy_key_replace_me');

// Payment Intent erstellen
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, bookingData, persons, selectedShop, lang = 'de' } = req.body;
    
    console.log('💳 Creating payment intent for:', {
      amount,
      bookingNumber: bookingData.booking_number,
      customer: persons[0].customerEmail
    });
    
    // Validate Stripe key
    if (!stripeKey || stripeKey === 'sk_test_dummy_key_replace_me') {
      throw new Error('Stripe Secret Key is not configured properly');
    }
    
    // Payment Intent mit Metadata erstellen
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe verwendet Cent-Beträge
      currency: 'eur',
      metadata: {
        booking_number: bookingData.booking_number,
        customer_email: persons[0].customerEmail,
        customer_name: persons[0].customerName,
        shop: selectedShop.name,
        persons_count: persons.length.toString(),
        lang: lang,
        booking_data: JSON.stringify(bookingData),
        persons_data: JSON.stringify(persons),
        shop_data: JSON.stringify(selectedShop)
      },
      description: `Sport2000 Booking ${bookingData.booking_number}`,
      receipt_email: persons[0].customerEmail,
      automatic_payment_methods: {
        enabled: true,
      }
    });
    
    console.log('✅ Payment intent created:', paymentIntent.id);
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('❌ Payment intent error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Stripe Webhook Handler
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  try {
    let event;
    
    if (webhookSecret) {
      // Verify webhook signature if secret is configured
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } else {
      // For testing without webhook verification
      console.warn('⚠️  Webhook signature verification skipped - no STRIPE_WEBHOOK_SECRET configured');
      event = JSON.parse(req.body.toString());
    }
    
    console.log('🎣 Webhook received:', event.type);
    
    // Payment erfolgreich
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;
      
      console.log('💰 Payment succeeded for booking:', metadata.booking_number);
      
      try {
        // Parse die gespeicherten Daten
        const bookingData = JSON.parse(metadata.booking_data);
        const persons = JSON.parse(metadata.persons_data);
        const selectedShop = JSON.parse(metadata.shop_data);
        
        // Email senden (aus payment-utils.js)
        await sendBookingConfirmation({
          bookingData,
          persons,
          selectedShop,
          lang: metadata.lang,
          paymentIntentId: paymentIntent.id
        });
        
        console.log('✅ Booking confirmation sent');
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
        // Don't fail the webhook, payment was successful
      }
    }
    
    // Payment fehlgeschlagen
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.error('❌ Payment failed for:', paymentIntent.metadata.booking_number);
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Payment Status prüfen
export const checkPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      metadata: paymentIntent.metadata
    });
    
  } catch (error) {
    console.error('❌ Check payment status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Refund erstellen (für Admin)
export const createRefund = async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Teilerstattung wenn amount angegeben
      reason: reason || 'requested_by_customer'
    });
    
    console.log('💸 Refund created:', refund.id);
    
    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status
    });
    
  } catch (error) {
    console.error('❌ Refund error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};