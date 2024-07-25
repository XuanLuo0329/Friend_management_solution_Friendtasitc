import React from "react";
import UserHome from "./UserHome";
import GuestHome from "./GuestHome";

export default function Home() {
  const user = localStorage.getItem('token');
  return user? <UserHome/> : <GuestHome/>
}