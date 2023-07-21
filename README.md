# Set-up

## 1. .env file

```sh
cp .env.template .env
```

Then, edit `.env`, following the instructions from within the file

## 2. Install dependencies

```sh
npm install
```

### 3. Set `overrideC2ResponseStripePaymentRequest`

In `src/server/index.html`, set `overrideC2ResponseStripePaymentRequest` to the value of a `stripe:paymentRequest` object from the response to a C2 call.

Running this project will then demonstrate the front-end for confirming a payment

# Running

```sh
npm run start:watch
```

Then, visit: `http://localhost:3000/` on your browser
