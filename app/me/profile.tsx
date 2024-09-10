"use client";

import accountApiRequest from "@/apiRequests/account";
import envConfig from "@/config";
import { cookies } from "next/headers";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      const result = await accountApiRequest.meClient();
    };
    fetchRequest();
  }, []);
  return <div>P</div>;
}
