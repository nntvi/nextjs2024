"use client";
import React, { useState } from "react";
import "./card.css";
import custom from "./custom.module.css";
import clsx from "clsx";
export default function Card() {
  const [expanding, setExpanding] = useState(false);

  return (
    <div
      className={clsx(`card`, {
        [custom.card]: expanding,
      })}
    >
      Card
    </div>
  );
}
