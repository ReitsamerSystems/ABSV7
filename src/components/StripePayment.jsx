import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { CreditCard, Loader, CheckCircle, AlertCircle } from 'lucide-react';

// Stripe Promise (außerhalb der Component)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Checkout Form Component
const CheckoutForm = ({ amount, onSuccess, onError, lang }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message);
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage(lang === 'de' ? 'Ein unerwarteter Fehler ist aufgetreten.' : 'An unexpected error occurred.');
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const texts = {
    de: {
      payNow: 'Jetzt bezahlen',
      processing: 'Verarbeitung...',
      securePayment: 'Sichere Zahlung mit Stripe',
      paymentMethods: 'Akzeptierte Zahlungsmethoden'
    },
    en: {
      payNow: 'Pay now',
      processing: 'Processing...',
      securePayment: 'Secure payment with Stripe',
      paymentMethods: 'Accepted payment methods'
    }
  };

  const t = texts[lang] || texts.de;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {lang === 'de' ? 'Zahlungsdetails' : 'Payment Details'}
          </h3>
          <p className="text-sm text-gray-600">{t.securePayment}</p>
        </div>

        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'sepa_debit', 'ideal', 'bancontact']
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        className="w-full bg-[#ec0008] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#d00007] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            {t.processing}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {t.payNow} - €{amount.toFixed(2)}
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">{t.paymentMethods}:</p>
        <div className="flex justify-center space-x-4">
          <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bfee8e7a8ecdc3a5a861.svg" alt="Visa" className="h-8" />
          <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-8" />
          <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96e418a6ca1717c.svg" alt="Amex" className="h-8" />
          <span className="text-gray-400">SEPA</span>
        </div>
      </div>
    </div>
  );
};

// Main Stripe Payment Component
const StripePayment = ({ amount, bookingData, persons, selectedShop, onSuccess, onBack, lang }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create Payment Intent
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            bookingData,
            persons,
            selectedShop,
            lang
          })
        });

        const data = await response.json();

        if (data.success) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, bookingData, persons, selectedShop, lang]);

  const handleSuccess = (paymentIntent) => {
    onSuccess(paymentIntent);
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
    setError(error.message);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-[#ec0008]" />
          <p className="text-gray-600">
            {lang === 'de' ? 'Zahlungsformular wird geladen...' : 'Loading payment form...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {lang === 'de' ? 'Fehler beim Laden' : 'Loading Error'}
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {lang === 'de' ? 'Zurück' : 'Back'}
          </button>
        </div>
      </div>
    );
  }


  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#ec0008',
      fontFamily: 'system-ui, sans-serif',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
    locale: lang === 'en' ? 'en' : 'de'  // <-- NEU: Sprache setzen
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {lang === 'de' ? 'Zahlung abschließen' : 'Complete Payment'}
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              {lang === 'de' 
                ? '💡 Ihre Buchung ist reserviert. Nach erfolgreicher Zahlung erhalten Sie eine Bestätigung per Email.'
                : '💡 Your booking is reserved. After successful payment, you will receive a confirmation by email.'
              }
            </p>
          </div>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm 
              amount={amount} 
              onSuccess={handleSuccess}
              onError={handleError}
              lang={lang}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default StripePayment;