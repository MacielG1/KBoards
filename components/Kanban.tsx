"use client";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";

export default function Kanban() {
  return (
    <div>
      <Sidebar />
      <Board />;
    </div>
  );
}
