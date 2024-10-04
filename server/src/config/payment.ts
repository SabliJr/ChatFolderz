import Stripe from "stripe";
import { STRIPES_SECRET_KEY } from "../Constants/index";

const stripe = new Stripe(STRIPES_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});

export default stripe;
