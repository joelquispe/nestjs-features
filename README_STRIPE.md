# Stripe Payment Module

A comprehensive NestJS module for handling Stripe payments with support for Payment Intents, Checkout Sessions, and webhook handling.

## Features

- ✅ **Payment Intents** - Create and confirm payments on the client side
- ✅ **Checkout Sessions** - Create hosted payment pages
- ✅ **Payment Methods** - Create, manage, and store customer payment methods
- ✅ **Customer Management** - Automatic customer creation and retrieval
- ✅ **Webhook Handling** - Process Stripe webhook events
- ✅ **Comprehensive Validation** - Request validation with class-validator
- ✅ **Swagger Documentation** - Complete API documentation
- ✅ **Error Handling** - Proper error responses and logging
- ✅ **TypeScript Support** - Full type safety

## Installation

The Stripe library is already installed. You just need to configure your environment variables.

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## API Endpoints

### Payment Intents

#### Create Payment Intent
```http
POST /stripe/payment-intent
Content-Type: application/json

{
  "amount": 2000,
  "currency": "usd",
  "customerEmail": "customer@example.com",
  "description": "Payment for order #123",
  "customerName": "John Doe",
  "metadata": {
    "orderId": "123",
    "productId": "456"
  }
}
```

#### Get Payment Intent
```http
GET /stripe/payment-intent/{paymentIntentId}
```

#### Confirm Payment Intent
```http
POST /stripe/payment-intent/{paymentIntentId}/confirm
Content-Type: application/json

{
  "paymentMethodId": "pm_1234567890abcdef",
  "returnUrl": "https://yourdomain.com/return"
}
```

#### Cancel Payment Intent
```http
DELETE /stripe/payment-intent/{paymentIntentId}
```

### Checkout Sessions

#### Create Checkout Session
```http
POST /stripe/checkout-session
Content-Type: application/json

{
  "lineItems": [
    {
      "name": "Premium Subscription",
      "description": "Monthly premium subscription",
      "price": 1999,
      "quantity": 1,
      "images": ["https://example.com/image.jpg"]
    }
  ],
  "currency": "usd",
  "customerEmail": "customer@example.com",
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/cancel",
  "metadata": {
    "orderId": "123",
    "customerId": "456"
  }
}
```

#### Get Checkout Session
```http
GET /stripe/checkout-session/{sessionId}
```

### Payment Methods

#### Create Payment Method
```http
POST /stripe/payment-methods
Content-Type: application/json

{
  "type": "card",
  "customerEmail": "customer@example.com",
  "card": {
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2025,
    "cvc": "123"
  },
  "billing_details": {
    "name": "John Doe",
    "email": "customer@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    }
  },
  "metadata": {
    "source": "mobile_app",
    "user_id": "123"
  }
}
```

#### Get Payment Method
```http
GET /stripe/payment-methods/{paymentMethodId}
```

#### List Payment Methods
```http
GET /stripe/payment-methods?customerEmail=customer@example.com&type=card&limit=10
```

#### Attach Payment Method
```http
POST /stripe/payment-methods/attach
Content-Type: application/json

{
  "paymentMethodId": "pm_1234567890abcdef",
  "customerEmail": "customer@example.com"
}
```

#### Update Payment Method
```http
PUT /stripe/payment-methods/{paymentMethodId}
Content-Type: application/json

{
  "billing_details": {
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phone": "+1987654321",
    "address": {
      "line1": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postal_code": "90210",
      "country": "US"
    }
  },
  "metadata": {
    "updated_by": "user",
    "last_update": "2024-01-15"
  }
}
```

#### Detach Payment Method
```http
DELETE /stripe/payment-methods/{paymentMethodId}/detach
```

### Webhooks

#### Handle Webhook
```http
POST /stripe/webhook
stripe-signature: t=1234567890,v1=abcdef...
Content-Type: application/json

{Raw webhook payload from Stripe}
```

## Usage Examples

### Frontend Integration with Payment Intents

```javascript
// 1. Create Payment Intent on your backend
const response = await fetch('/stripe/payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 2000, // $20.00
    currency: 'usd',
    customerEmail: 'customer@example.com',
    description: 'Payment for order #123'
  })
});

const { clientSecret } = await response.json();

// 2. Use Stripe.js to confirm payment on frontend
const stripe = Stripe('pk_test_...');
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'Customer Name',
      email: 'customer@example.com'
    }
  }
});

if (error) {
  console.error('Payment failed:', error);
} else if (paymentIntent.status === 'succeeded') {
  console.log('Payment succeeded:', paymentIntent);
}
```

### Frontend Integration with Checkout Sessions

```javascript
// 1. Create Checkout Session on your backend
const response = await fetch('/stripe/checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    lineItems: [
      {
        name: 'Premium Plan',
        description: 'Monthly subscription',
        price: 1999, // $19.99
        quantity: 1
      }
    ],
    currency: 'usd',
    customerEmail: 'customer@example.com',
    successUrl: 'https://yourdomain.com/success',
    cancelUrl: 'https://yourdomain.com/cancel'
  })
});

const { url } = await response.json();

// 2. Redirect to Stripe Checkout
window.location.href = url;
```

### Frontend Integration with Payment Methods

```javascript
// 1. Create Payment Method on your backend
const response = await fetch('/stripe/payment-methods', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'card',
    customerEmail: 'customer@example.com',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    },
    billing_details: {
      name: 'John Doe',
      email: 'customer@example.com'
    }
  })
});

const paymentMethod = await response.json();
console.log('Payment Method created:', paymentMethod);

// 2. List customer's payment methods
const listResponse = await fetch('/stripe/payment-methods?customerEmail=customer@example.com&type=card');
const { data: paymentMethods } = await listResponse.json();
console.log('Customer payment methods:', paymentMethods);

// 3. Use payment method with Payment Intent
const paymentIntentResponse = await fetch('/stripe/payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 2000,
    currency: 'usd',
    customerEmail: 'customer@example.com',
    description: 'Payment using saved card'
  })
});

const { clientSecret } = await paymentIntentResponse.json();

// 4. Confirm payment using saved payment method
const stripe = Stripe('pk_test_...');
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: paymentMethod.id
});
```

## Webhook Setup

1. **Configure Webhook in Stripe Dashboard:**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://yourdomain.com/stripe/webhook`
   - Select events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Copy Webhook Secret:**
   - Copy the webhook signing secret from Stripe Dashboard
   - Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Supported Webhook Events

The module automatically handles these Stripe webhook events:

- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `checkout.session.completed` - Checkout session completed
- `invoice.payment_succeeded` - Invoice payment succeeded
- `invoice.payment_failed` - Invoice payment failed

You can extend the webhook handler in `StripeService.handleWebhook()` to add your business logic.

## Error Handling

The module provides comprehensive error handling:

- **Validation Errors**: Invalid request data returns 400 Bad Request
- **Stripe API Errors**: Stripe API failures return 400 Bad Request with error details
- **Not Found Errors**: Non-existent resources return 404 Not Found
- **Webhook Verification**: Invalid webhook signatures return 400 Bad Request

## Security Features

- **Webhook Signature Verification**: All webhooks are verified using Stripe's signature
- **Environment Variables**: Sensitive keys stored in environment variables
- **Request Validation**: All requests validated using class-validator
- **Customer Isolation**: Customers are automatically managed and isolated

## Testing

### Test with cURL

Create Payment Intent:
```bash
curl -X POST http://localhost:3000/stripe/payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2000,
    "currency": "usd",
    "customerEmail": "test@example.com",
    "description": "Test payment"
  }'
```

Create Checkout Session:
```bash
curl -X POST http://localhost:3000/stripe/checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "lineItems": [{
      "name": "Test Product",
      "description": "Test description",
      "price": 1999,
      "quantity": 1
    }],
    "currency": "usd",
    "customerEmail": "test@example.com",
    "successUrl": "https://example.com/success",
    "cancelUrl": "https://example.com/cancel"
  }'
```

Create Payment Method:
```bash
curl -X POST http://localhost:3000/stripe/payment-methods \
  -H "Content-Type: application/json" \
  -d '{
    "type": "card",
    "customerEmail": "test@example.com",
    "card": {
      "number": "4242424242424242",
      "exp_month": 12,
      "exp_year": 2025,
      "cvc": "123"
    },
    "billing_details": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'
```

List Payment Methods:
```bash
curl -X GET "http://localhost:3000/stripe/payment-methods?customerEmail=test@example.com&type=card&limit=10"
```

## Swagger Documentation

The module includes comprehensive Swagger documentation. Once your application is running, visit:

```
http://localhost:3000/api
```

All endpoints are documented with:
- Request/response schemas
- Parameter descriptions
- Example values
- Error responses

## Module Structure

```
src/modules/stripe/
├── controllers/
│   └── stripe.controller.ts     # API endpoints
├── services/
│   └── stripe.service.ts        # Business logic
├── dtos/
│   ├── create-payment-intent-req.dto.ts
│   ├── create-checkout-session-req.dto.ts
│   ├── payment-intent-resp.dto.ts
│   ├── checkout-session-resp.dto.ts
│   ├── confirm-payment-req.dto.ts
│   ├── webhook-req.dto.ts
│   ├── create-payment-method-req.dto.ts
│   ├── payment-method-resp.dto.ts
│   ├── attach-payment-method-req.dto.ts
│   ├── list-payment-methods-req.dto.ts
│   ├── payment-methods-list-resp.dto.ts
│   ├── update-payment-method-req.dto.ts
│   └── index.ts
└── stripe.module.ts             # Module definition
```

## Contributing

When adding new features:

1. Add appropriate DTOs with validation
2. Update the service with business logic
3. Add controller endpoints with Swagger documentation
4. Update this README with usage examples
5. Add error handling and logging

## Support

For Stripe-specific issues, refer to the [Stripe Documentation](https://stripe.com/docs).

For module-specific issues, check the application logs for detailed error messages.

## Complete API Reference

### Payment Intents
- `POST /stripe/payment-intent` - Create Payment Intent
- `GET /stripe/payment-intent/{id}` - Get Payment Intent
- `POST /stripe/payment-intent/{id}/confirm` - Confirm Payment Intent
- `DELETE /stripe/payment-intent/{id}` - Cancel Payment Intent

### Checkout Sessions
- `POST /stripe/checkout-session` - Create Checkout Session
- `GET /stripe/checkout-session/{id}` - Get Checkout Session

### Payment Methods
- `POST /stripe/payment-methods` - Create Payment Method
- `GET /stripe/payment-methods/{id}` - Get Payment Method
- `GET /stripe/payment-methods` - List Payment Methods
- `POST /stripe/payment-methods/attach` - Attach Payment Method
- `PUT /stripe/payment-methods/{id}` - Update Payment Method
- `DELETE /stripe/payment-methods/{id}/detach` - Detach Payment Method

### Webhooks
- `POST /stripe/webhook` - Handle Stripe Webhooks

## Complete Payment Flow Example

Here's a complete example of how to implement a payment flow using saved payment methods:

### Step 1: Create and Save Payment Method
```javascript
// Frontend: Collect card information using Stripe Elements
const stripe = Stripe('pk_test_...');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Backend: Create payment method
const paymentMethodResponse = await fetch('/stripe/payment-methods', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'card',
    customerEmail: 'customer@example.com',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    },
    billing_details: {
      name: 'John Doe',
      email: 'customer@example.com'
    }
  })
});
const paymentMethod = await paymentMethodResponse.json();
```

### Step 2: Create Payment Intent
```javascript
const paymentIntentResponse = await fetch('/stripe/payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 2000, // $20.00
    currency: 'usd',
    customerEmail: 'customer@example.com',
    description: 'Payment for order #123'
  })
});
const { clientSecret } = await paymentIntentResponse.json();
```

### Step 3: Confirm Payment
```javascript
// Using saved payment method
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: paymentMethod.id
});

if (error) {
  console.error('Payment failed:', error);
} else if (paymentIntent.status === 'succeeded') {
  console.log('Payment succeeded!');
}
```

### Step 4: Handle Webhooks (Backend)
Your webhook endpoint will automatically handle payment confirmations and update your application state accordingly.

## Production Checklist

Before going to production:

1. **✅ Update API Keys**: Replace test keys with live keys
2. **✅ Configure Webhooks**: Set up webhook endpoints in Stripe Dashboard
3. **✅ Test Error Scenarios**: Test declined cards, network failures, etc.
4. **✅ Implement Logging**: Ensure proper logging for debugging
5. **✅ Set up Monitoring**: Monitor payment success rates and failures
6. **✅ Backup Customer Data**: Implement proper data backup strategies
7. **✅ Security Review**: Ensure PCI compliance and security best practices

## Best Practices

- **Never store sensitive card data** - Always use Stripe's secure vaults
- **Validate on both sides** - Client and server-side validation
- **Handle errors gracefully** - Provide clear error messages to users
- **Use idempotency keys** - For retrying failed requests safely
- **Monitor webhook events** - Set up alerts for failed webhooks
- **Test with real scenarios** - Use Stripe's test cards for different scenarios 