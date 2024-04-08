import React from "react";
import type { BoardType } from "@/store/store";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export default function ExportCSV({ data }: { data: BoardType }) {
  function handleDownload() {
    const csvData: Record<string, { title: string; items: string }> = {};
    data.lists?.forEach((list) => {
      csvData[list.id] = {
        title: list.title,
        items: list.items.map((item) => item.content).join("\n"),
      };
    });

    // Extract column headers and items
    const columns = Object.keys(csvData);
    const rows = Array.from({ length: Math.max(...Object.values(csvData).map((column) => column.items.split("\n").length)) }, (_, index) =>
      columns.map((column) => csvData[column].items.split("\n")[index] || ""),
    );

    // Format into CSV
    const csvContent = [columns.map((column) => csvData[column].title).join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <Button variant="ghost" onClick={handleDownload} className="h-auto w-full justify-start rounded-none p-1 px-4 py-2 pl-4 text-sm font-normal">
      <Download className="mr-2 size-4" /> Export CSV
    </Button>
  );
}
