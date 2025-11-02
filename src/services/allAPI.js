import { commonAPI } from "./commonAPI";
import { serverURL } from "./serverURL";

// 💰 EXPENSE CRUD
export const addExpenseAPI = async (expense) =>
  await commonAPI("POST", `${serverURL}/expenses`, expense);

export const getExpensesAPI = async () =>
  await commonAPI("GET", `${serverURL}/expenses`, "");

export const deleteExpenseAPI = async (id) =>
  await commonAPI("DELETE", `${serverURL}/expenses/${id}`, {});

export const updateExpenseAPI = async (id, expense) =>
  await commonAPI("PUT", `${serverURL}/expenses/${id}`, expense);

// 👤 AUTH (unchanged)
export const registerUserAPI = async (userData) =>
  await commonAPI("POST", `${serverURL}/users`, userData);

export const getUsersAPI = async () =>
  await commonAPI("GET", `${serverURL}/users`, "");

export const loginUserAPI = async (email, password) =>
  await commonAPI(
    "GET",
    `${serverURL}/users?email=${email}&password=${password}`,
    ""
  );
