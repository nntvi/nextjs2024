import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import React from "react";

export default function HeaderComponent() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
}
