import { Router } from "express";
import bodyParser from "body-parser";

// Controllers
import { userLogout, onAuthWithGoogle } from "../controllers/gAuth";
import {
  onCheckOut,
  onSubscriptionSuccess,
  onStripeWebhooks,
  onCancelSubscription,
  onCheckOutOneTimeWithTrial,
} from "../controllers/paymentController";

import { onGetCredentials } from "../controllers/refreshTokenController";
import {
  onStoreUserFolders,
  onGetUserFolders,
  onDeleteFolder,
  onEditFolder,
  onAddChat,
  onRemoveChat,
  onUpdateFolderOrChat,
} from "../controllers/folderzController";

const router = Router();

// Authentication routes
// router.get("/logout", userLogout); // logout creator
router.post("/auth/google", onAuthWithGoogle); // google sign in
router.get("/get_credentials", onGetCredentials);

// PAYMENT ROUTES
router.get("/check_out", onCheckOut);
router.get("/check_out_onetime", onCheckOutOneTimeWithTrial);
router.get("/checkout_success", onSubscriptionSuccess);
router.get("/cancel_subscription", onCancelSubscription);
router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  onStripeWebhooks
);

// Managing folders
router.post("/store_folder", onStoreUserFolders);
router.get("/get_user_folders", onGetUserFolders);
router.delete("/delete_folder", onDeleteFolder);
router.put("/edit_folder", onEditFolder);
router.post("/add_chat", onAddChat);
router.delete("/remove_chat", onRemoveChat);
router.post("/update_folder_or_chat", onUpdateFolderOrChat);

export default router;
