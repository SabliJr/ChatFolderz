import axios from "axios";

const SERVER_URL =
  process.env?.NODE_ENV === "production"
    ? "https://www.api.chatfolderz.com"
    : "http://localhost:8000";

const onSuccessCheckingOut = async (session_id: string) => {
  return await axios.get(`${SERVER_URL}/checkout_success`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { session_id },
    withCredentials: true,
  });
};

const onCheckingOut = async (price_id: string) => {
  return await axios.get(`${SERVER_URL}/check_out`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { price_id },
    withCredentials: true,
  });
};

const onCheckOutOneTime = async (price_id: string) => {
  return await axios.get(`${SERVER_URL}/check_out_lifetime`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { price_id },
    withCredentials: true,
  });
};

export { onSuccessCheckingOut, onCheckingOut, onCheckOutOneTime };
