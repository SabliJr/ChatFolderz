import axios from "axios";

// const SERVER_URL = "http://localhost:8000/api";
const SERVER_URL =
  process.env?.NODE_ENV === "production"
    ? "https://api.wishties.com/api"
    : "http://localhost:8000/api";

const onRequestVerificationAgain = async (email: string) => {
  return await axios.post(
    `${SERVER_URL}/request-verification-again`,
    JSON.stringify({ email }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onSignUpWithGoogle = async (token: string) => {
  return await axios.get(`${SERVER_URL}/auth/google/callback`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { token }, // Passing the token as a query parameter
    withCredentials: true,
  });
};

const onVerifyEmail = async (token: string) => {
  return await axios.get(`${SERVER_URL}/verify-email`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { token }, // Passing the token as a query parameter
    withCredentials: true,
  });
};

const onRefreshToken = async () => {
  return await axios.get(`${SERVER_URL}/refresh-token`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const axiosPrivate = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const onLogout = async () => {
  return await axios.get(`${SERVER_URL}/logout`, {
    withCredentials: true,
  });
};

const onCheckOut = async (purchaseDetails: any) => {
  return await axios.post(
    `${SERVER_URL}/create-checkout-session`,
    purchaseDetails,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

export {
  onLogout,
  onRequestVerificationAgain,
  onRefreshToken,
  onVerifyEmail,
  onCheckOut,
  onSignUpWithGoogle,
};
