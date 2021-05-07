import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/user/`,
});

export const signup = (data) => API.post("signup", data);
export const signin = (data) => API.post("signin", data);
export const fetchUser = (token) => API.get("me", { headers: { token } });
export const addContact = (token, email) =>
  API.post("contacts", email, { headers: { token } });
export const deleteContact = (token, contact) =>
  API.delete(`contacts/${contact}`, { headers: { token } });

export const fetchContact = (token, contact) =>
  API.get(`contact/${contact}`, { headers: { token } });

export const postConversation = (token, name, recipients) =>
  API.post("conversation", { name, recipients }, { headers: { token } });

export const getConversations = (token) =>
  API.get("conversations", { headers: { token } });

export const fetchConversation = (token, conversationId) =>
  API.get(`conversation/${conversationId}`, { headers: { token } });

export const deleteConversation = (token, conversationId) =>
  API.delete(`conversation/${conversationId}`, { headers: { token } });

export const postMessage = (token, request) =>
  API.post("message", { request }, { headers: { token } });
