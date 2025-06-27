import React from 'react';
import StripePayment from './StripePayment';

const PaymentStep = ({ 
  persons, 
  selectedShop, 
  bookingNumber,
  onSuccess, 
  onBack, 
  lang 
}) => {
  // Calculate total amount
  const totalAmount = persons.reduce((sum, person) => sum + person.totalPrice, 0);
  
  // Booking data
  const bookingData = {
    booking_number: bookingNumber,
    timestamp: new Date().toISOString()
  };
  
  return (
    <div className="space-y-6">
      {/* Summary before payment */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {lang === 'de' ? 'Buchungszusammenfassung' : 'Booking Summary'}
        </h3>
        
        <div className="space-y-3">
          {/* Shop Info */}
          <div className="flex justify-between items-start">
            <span className="text-gray-600">{lang === 'de' ? 'Abholort:' : 'Pickup Location:'}</span>
            <span className="font-medium text-right">
              {selectedShop.name}<br/>
              <span className="text-sm text-gray-500">
                {typeof selectedShop.address === 'string' ? selectedShop.address : selectedShop.address[lang]}
              </span>
            </span>
          </div>
          
          {/* Persons */}
          <div className="border-t pt-3">
            <div className="font-medium mb-2">
              {lang === 'de' ? 'Personen:' : 'Persons:'}
            </div>
            {persons.map((person, index) => (
              <div key={index} className="ml-4 mb-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    {person.customerName} 
                    <span className="text-gray-500 ml-2">
                      ({person.category}, {person.days} {lang === 'de' ? `Tag${person.days > 1 ? 'e' : ''}` : `day${person.days > 1 ? 's' : ''}`})
                    </span>
                  </span>
                  <span className="font-medium">€{person.totalPrice.toFixed(2)}</span>
                </div>
                {person.extras.length > 0 && (
                  <div className="text-gray-500 text-xs mt-1">
                    + {person.extras.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{lang === 'de' ? 'Gesamtbetrag:' : 'Total Amount:'}</span>
              <span className="text-[#ec0008]">€{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stripe Payment Component */}
      <StripePayment
        amount={totalAmount}
        bookingData={bookingData}
        persons={persons}
        selectedShop={selectedShop}
        onSuccess={onSuccess}
        onBack={onBack}
        lang={lang}
      />
    </div>
  );
};

export default PaymentStep;