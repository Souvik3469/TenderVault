import React from "react";
import Navbar from "../Components/Navbar";
import AdminDashboard from "../Components/admin/AdminDashboard";
import { GetMyDetailsQuery } from "../api/user";
import Loading from "../Components/utils/Loading";

const AdminDashboardPage = () => {
  const { data: user, isLoading } = GetMyDetailsQuery();

  if (isLoading) return <Loading />;

  return (
    <div className="page-container flex flex-col h-screen">
      <Navbar user={user} />
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
