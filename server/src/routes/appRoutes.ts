import { Router } from "express";
import bodyParser from "body-parser";

// Controllers
import { userLogout, onAuthWithGoogle } from "../controllers/gAuth";
import {
  onCheckOut,
  onSubscriptionSuccess,
  onStripeWebhooks,
  onCancelSubscription,
} from "../controllers/paymentController";

import {
  onGetCredentials,
  onGetTest,
} from "../controllers/refreshTokenController";

const router = Router();

// Authentication routes
// router.get("/logout", userLogout); // logout creator
router.post("/auth/google", onAuthWithGoogle); // google sign in
router.get("/get_credentials", onGetCredentials);

router.get("/get_test", onGetTest);

// PAYMENT ROUTES
router.get("/check_out/monthly", onCheckOut);
router.get("/check_out/yearly", onCheckOut);
router.get("/checkout_success", onSubscriptionSuccess);
router.get("/cancel_subscription", onCancelSubscription);
router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  onStripeWebhooks
);

export default router;
