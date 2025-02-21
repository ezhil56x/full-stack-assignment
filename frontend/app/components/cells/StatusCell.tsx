import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { smallFirstLetter } from "@/lib/utils";
import { useState } from "react";

function StatusCell({ row }) {
  const initialStatus = row.getValue("status") || "Pending";
  const [status, setStatus] = useState(initialStatus);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    const response = await fetch(`${BACKEND_URL}/api/task/${row.original.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        status: smallFirstLetter(newStatus),
      }),
    });

    if (!response.ok) {
      console.error("Failed to update status");
      toast({ description: "Failed to update status" });
    } else {
      toast({ description: "Status updated" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {["Pending", "Completed", "InProgress"].map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleStatusChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StatusCell;
