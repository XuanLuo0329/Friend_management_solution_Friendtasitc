import React from "react";
import UserHeader from "./UserHeader";
import GuestHeader from "./GuestHeader";

export default function WebHeader() {
  const user = localStorage.getItem('token');
  return user? <UserHeader/> : <GuestHeader/>
}