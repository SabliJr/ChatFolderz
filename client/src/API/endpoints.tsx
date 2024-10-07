import axios from "axios";

const SERVER_URL =
  process.env?.NODE_ENV === "production"
    ? "https://www.api.chatfolderz.com/api"
    : "http://localhost:8000/api";

const onSuccessCheckingOut = async (session_id: string) => {
  return await axios.get(`${SERVER_URL}/checkout_success`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { session_id },
    withCredentials: true,
  });
};

export { onSuccessCheckingOut };
