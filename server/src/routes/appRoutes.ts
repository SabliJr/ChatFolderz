import { Router } from "express";

// Controllers
import { userLogout, onAuthWithGoogle } from "../controllers/gAuth";
import {
  onCheckOut,
  onSubscriptionSuccess,
} from "../controllers/paymentController";

import { handleRefreshToken } from "../controllers/refreshTokenController";

const router = Router();

// Authentication routes
router.get("/logout", userLogout); // logout creator
router.get("/refresh-token", handleRefreshToken); // refresh token
router.post("/auth/google", onAuthWithGoogle); // google sign in

// PAYMENT ROUTES
router.get("/check_out/monthly", onCheckOut);
router.get("/check_out/yearly", onCheckOut);
router.get("/checkout_success", onSubscriptionSuccess);

export default router;
