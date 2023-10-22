import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the AuthAPI function to create Axios instance
const AuthAPI = () => {
  if (typeof window !== "undefined") {
    return axios.create({
      baseURL: `http://localhost:5000/v1`,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: `http://localhost:5000/v1`,
      headers: {
        authorization: `Bearer`,
        "Content-Type": "application/json",
      },
    });
  }
};

// Function to create a new tender
const createTender = async (tenderInfo) => {
  const { data } = await AuthAPI().post("/user/createtender", tenderInfo);
  return data;
};

// Function to update a tender
const updateTender = async (tenderId, tenderInfo) => {
  const { data } = await AuthAPI().put(`/user/updatetender?id=${tenderId}`, tenderInfo);
  return data;
};

// Function to delete a tender
const deleteTender = async (tenderId) => {
  const { data } = await AuthAPI().delete(`/user/deletetender?id=${tenderId}`);
  return data;
};

// Function to get the user's tenders
const getMyTender = async () => {
  const { data } = await AuthAPI().get("/user/getmytender");
  return data;
};

// Function to get all tenders (consider changing the endpoint if needed)
const getAllTenders = async () => {
  const { data } = await AuthAPI().get("/user/getalltender");
  return data;
};

// Define a query for getting the user's tenders
// const getMyTendersQuery = () =>
//   useQuery({
//     queryKey: ["get-my-tenders"],
//     queryFn: () => getMyTender(),
//     select: (data) => {
//       const res = data.message;
//       return res;
//     },
//   });

  const getalltenderquery = () =>
  useQuery({
    queryKey: ["tenders"],
    queryFn: () => getAllTenders(),
    select: (data) => {
      const res = data.message;
      return res;
    },
  });

// Export the functions and queries
export { createTender, updateTender, deleteTender ,getalltenderquery};
