import React from "react";
import Navbar from "./ui/Navbar";
import { Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";

const Home = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default Home;
