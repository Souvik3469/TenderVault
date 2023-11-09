import { useQuery } from "@tanstack/react-query";
import axios from "axios";


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


const createTender = async (tenderInfo) => {
  const { data } = await AuthAPI().post("/user/createtender", tenderInfo);
  return data;
};


const updateTender = async (tenderId, tenderInfo) => {
  const { data } = await AuthAPI().put(`/user/updatetender?id=${tenderId}`, tenderInfo);
  return data;
};
const reviewTender = async (tenderId, rating) => {
 const { data } = await AuthAPI().put(`/user/updatetender?id=${tenderId}`, rating);
  return data;
};

const deleteTender = async (tenderId) => {
  const { data } = await AuthAPI().delete(`/user/deletetender?id=${tenderId}`);
  return data;
};




const getMyTender = async () => {
  const { data } = await AuthAPI().get("/user/getmytender");
  return data;
};


const getAllTenders = async () => {
  const { data } = await AuthAPI().get("/user/getalltender");
  return data;
};
const tenderdetails = async (tenderId) => {
  const { data } = await AuthAPI().get(`/user/tenderdetails/${tenderId}`);
  return data;
};
const searchTenders = async (searchQuery) => {

    const { data } = await AuthAPI().get(`/user/searchtender?name=${searchQuery}`);
    return data;
 
};

const getAllCategories = async () => {
  const { data } = await AuthAPI().get("/user/getcategory");
  return data;
};


const getMyTendersQuery = () =>
  useQuery({
    queryKey: ["get-my-tenders"],
    queryFn: () => getMyTender(),
    select: (data) => {
      const res = data.data;
      return res;
    },
  });

  const getalltenderquery = () =>
  useQuery({
    queryKey: ["tenders"],
    queryFn: () => getAllTenders(),
    select: (data) => {
      const res = data.message;
      return res;
    },
  });
  const getallcategoryquery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    select: (data) => {
      const res = data.data;
      return res;
    },
  });
  const tenderdetailsquery = (tenderId) =>
  useQuery({
    queryKey: ["tenderdetails",tenderId],
    queryFn: () => tenderdetails(tenderId),
    select: (data) => {
      console.log("Tenderdetails",data.data);
      return data.data;
    },
  });
  const searchTendersQuery = (searchQuery) =>
  useQuery({
    queryKey: ["search-tenders", searchQuery],
    queryFn: () => searchTenders(searchQuery),
    select: (data) => {
      console.log("Search",data)
      return data;
    },
  });


export { createTender, updateTender,reviewTender, deleteTender ,getalltenderquery,getMyTendersQuery,getallcategoryquery,tenderdetailsquery,searchTendersQuery};
