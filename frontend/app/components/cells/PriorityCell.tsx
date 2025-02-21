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

function PriorityCell({ row }) {
  const initialPriority = row.getValue("priority") || "Low";
  const [priority, setPriority] = useState(initialPriority);

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority);
    const response = await fetch(`${BACKEND_URL}/api/task/${row.original.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        priority: smallFirstLetter(newPriority),
      }),
    });

    if (!response.ok) {
      console.error("Failed to update priority");
      toast({ description: "Failed to update priority" });
    } else {
      toast({ description: "Priority updated" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {priority}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {["Low", "Medium", "High"].map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handlePriorityChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PriorityCell;
