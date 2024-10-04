import { Router } from "express";
import bodyParser from "body-parser";

// Controllers
import {
  userLogout,
  onAuthWithGoogle,
} from "../controllers/loginRegistrationRoutes";
import {
  onPaymentSetup,
  onStripeReturn,
  onPaymentSetupRefresh,
  onPurchase,
  onPaymentComplete,
} from "../controllers/paymentController";

import { authenticateCreator } from "../validators/authValidation";
import { handleRefreshToken } from "../controllers/refreshTokenController";

const router = Router();

// Authentication routes
router.get("/logout", userLogout); // logout creator
router.get("/refresh-token", handleRefreshToken); // refresh token
router.get("/auth/google/callback", onAuthWithGoogle); // google sign in

router.post("/reset-password"); // reset password

// PAYMENT ROUTES
router.post("/stripe/reauth", authenticateCreator, onPaymentSetupRefresh); // Stripe connect initial route
router.get("/stripe/return?:creator_id", onStripeReturn); // Stripe connect return route
router.post("/create-checkout-session", onPurchase);
router.post(
  "/payment-completed/webhook",
  bodyParser.raw({ type: "application/json" }),
  onPaymentComplete
); // Stripe webhook route;

export default router;
