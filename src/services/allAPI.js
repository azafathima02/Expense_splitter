import axios from "axios";

export const BASE_URL = "http://localhost:3000"; // match your JSON server port

// ------------------- USERS -------------------

// Fetch all users
export const getUsersAPI = async () => {
  return await axios.get(`${BASE_URL}/users`);
};

// Register new user
export const addUserAPI = async (userData) => {
  return await axios.post(`${BASE_URL}/users`, userData);
};

// Get a single user by ID (optional)
export const getUserByIdAPI = async (id) => {
  return await axios.get(`${BASE_URL}/users/${id}`);
};

// ------------------- GROUPS -------------------

// Fetch all groups
export const getGroupsAPI = () => axios.get(`${BASE_URL}/groups`);


// Add new group
export const addGroupAPI = async (groupData) => {
  return await axios.post(`${BASE_URL}/groups`, groupData);
};

// Update group details (like name or members)
export const updateGroupAPI = async (id, groupData) => {
  return await axios.put(`${BASE_URL}/groups/${id}`, groupData);
};

// Delete a group
export const deleteGroupAPI = async (id) => {
  return await axios.delete(`${BASE_URL}/groups/${id}`);
};

// ------------------- EXPENSES -------------------

// Fetch all expenses
export const getExpensesAPI = async () => {
  return await axios.get(`${BASE_URL}/expenses`);
};

// Add new expense
export const addExpenseAPI = async (expenseData) => {
  return await axios.post(`${BASE_URL}/expenses`, expenseData);
};

// Delete an expense by ID
export const deleteExpenseAPI = async (id) => {
  return await axios.delete(`${BASE_URL}/expenses/${id}`);
};

// Update an expense by ID
export const updateExpenseAPI = async (id, expenseData) => {
  return await axios.put(`${BASE_URL}/expenses/${id}`, expenseData);
};

// ------------------- MESSAGES (CHAT) -------------------

// Save chat message
export const addMessageAPI = async (messageData) => {
  return await axios.post(`${BASE_URL}/messages`, messageData);
};

// Get chat messages for a specific group
export const getMessagesByGroupAPI = async (groupId) => {
  return await axios.get(`${BASE_URL}/messages?groupId=${groupId}`);
};

// Delete a specific message (optional)
export const deleteMessageAPI = async (id) => {
  return await axios.delete(`${BASE_URL}/messages/${id}`);
};
