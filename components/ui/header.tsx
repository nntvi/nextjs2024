import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import React from "react";

export default function HeaderComponent() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
        <li>
          <ButtonLogout />
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
}
