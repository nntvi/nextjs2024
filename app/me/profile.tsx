"use client";

import accountApiRequest from "@/apiRequests/account";
import envConfig from "@/config";
import { handleErrorApi } from "@/lib/utils";
import { cookies } from "next/headers";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const result = await accountApiRequest.meClient();
        console.log("🚀 ~ fetchRequest ~ result:", result);
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    };
    fetchRequest();
  }, []);
  return <div>P</div>;
}
