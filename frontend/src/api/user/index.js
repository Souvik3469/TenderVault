import axios from "axios";
import { useQuery } from "@tanstack/react-query";



const AuthAPI = () => {
  if (typeof window !== "undefined") {
    return axios.create({
      baseURL: `http://localhost:5000/v1/`,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: `http://localhost:5000/v1/`,
      headers: {
        authorization: `Bearer }`,
        "Content-Type": "application/json",
      },
    });
  }
};
const GetUser = async () => {
  const { data } = await AuthAPI().get("/user/user-details");
  return data;
};
const GetUserQuery = () =>
  useQuery({
    queryKey: ["user-details"],
    queryFn: () => GetUser(),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });
const GetVendor = async () => {
  const { data } = await AuthAPI().get("/user/getvendors");
  return data;
};
const GetVendorQuery = () =>
  useQuery({
    queryKey: ["getvendor"],
    queryFn: () => GetVendor(),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });
const GetCompany = async () => {
  const { data } = await AuthAPI().get("/user/getcompany");
  return data;
};
const GetCompanyQuery = () =>
  useQuery({
    queryKey: ["getcompany"],
    queryFn: () => GetCompany(),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });

export { GetUserQuery ,GetVendorQuery,GetCompanyQuery};
