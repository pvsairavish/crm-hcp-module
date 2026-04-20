import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const sendChat = async (message, currentFormState) => {
  const res = await axios.post(`${BASE_URL}/chat`, {
    message,
    current_form_state: currentFormState,
  });
  return res.data;
};

export const saveInteraction = async (formData) => {
  const res = await axios.post(`${BASE_URL}/interactions`, formData);
  return res.data;
};