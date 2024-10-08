import { Router } from "express";
import bodyParser from "body-parser";

// Controllers
import {
  userLogout,
  onAuthWithGoogle,
  onGetCredentials,
} from "../controllers/gAuth";
import {
  onCheckOut,
  onSubscriptionSuccess,
  onStripeWebhooks,
} from "../controllers/paymentController";

import { handleRefreshToken } from "../controllers/refreshTokenController";

const router = Router();

// Authentication routes
router.get("/logout", userLogout); // logout creator
router.get("/refresh-token", handleRefreshToken); // refresh token
router.post("/auth/google", onAuthWithGoogle); // google sign in
router.get("/get_credentials", onGetCredentials);

// PAYMENT ROUTES
router.get("/check_out/monthly", onCheckOut);
router.get("/check_out/yearly", onCheckOut);
router.get("/checkout_success", onSubscriptionSuccess);
router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  onStripeWebhooks
);

export default router;
