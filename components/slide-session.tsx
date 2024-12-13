"use client";

import authApiRequest from "@/apiRequests/auth";
// import { clientSessionToken } from "@/lib/http";
import { differenceInHours } from "date-fns";
import { useEffect } from "react";

export default function SlideSession() {
  const slideSession = async () => {
    const res = await authApiRequest.slideSessionFromNextClientToNextServer();
    // clientSessionToken.expiresAt = res.payload.data.expiresAt;
    localStorage.setItem("sessionTokenExpiresAt", res.payload.data.expiresAt);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const sessionTokenExpiresAt = localStorage.getItem(
        "sessionTokenExpiresAt"
      );
      const expiresAt = sessionTokenExpiresAt
        ? new Date(sessionTokenExpiresAt)
        : new Date();
      if (differenceInHours(expiresAt, now) < 1) {
        await slideSession();
      }
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);
  return null;
}
