import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import stripe from 'stripe';

const IMIN_SECRET_KEY = process.env.IMIN_SECRET_KEY;

/**
 * Example of the format: {
 *   "@type": "stripe:PaymentIntent",
 *   "identifier": "pi_<...>",
 *   "stripe:clientSecret": "pi_<...>_secret_<...>",
 *   "stripe:publishableKey": "pk_test_<...>",
 *   "stripe:connectAccountIdentifier": "acct_<...>"
 * }
 *
 * Get this data by calling imin Booking API's C2 endpoint and copying the `stripe:paymentRequest` object
 * from the response.
 *
 * @type {{
 *   'stripe:clientSecret': string,
 *   'stripe:publishableKey': string,
 *   'stripe:connectAccountIdentifier': string,
 * } | undefined}
 */
const overrideC2ResponseStripePaymentRequest = undefined;

const theStripe = stripe(IMIN_SECRET_KEY);

const app = express();
app.use(bodyParser.json());

// This is just a stub to simulate the C2 endpoint of the imin Booking API.
app.get('/c2', async (req, res) => {
  console.log('/c2', req.query);
  res.json({ 'stripe:paymentRequest': overrideC2ResponseStripePaymentRequest });
  return;
});

// This is just a stub to simulate the B endpoint of the imin Booking API.
app.put('/b', async (req, res) => {
  console.log('/b', req.query);
  // const paymentIntentClientSecret = req.query.payment_intent_client_secret;
  // const paymentIntentId = req.query.payment_intent;
  const { paymentIntentId } = req.body;
  const retrievedPaymentIntent = await theStripe.paymentIntents.retrieve(
    paymentIntentId,
    { stripeAccount: overrideC2ResponseStripePaymentRequest['stripe:connectAccountIdentifier'] },
  );
  const capturedPaymentIntent = await theStripe.paymentIntents.capture(
    paymentIntentId,
    { stripeAccount: overrideC2ResponseStripePaymentRequest['stripe:connectAccountIdentifier'] },
  );
  // 
  res.json({
    retrievedPaymentIntent,
    capturedPaymentIntent,
  });
});

app.use(express.static('src/client'));

app.listen(3000, () => {
  console.log('Running on port 3000');
});
