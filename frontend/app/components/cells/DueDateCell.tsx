import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

function DueDateCell({ row }) {
  const initialDueDate = row.getValue("dueDate");
  const [dueDate, setDueDate] = useState(
    initialDueDate ? new Date(initialDueDate) : null
  );

  const handleDateChange = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDueDate(selectedDate);
    const formattedDate = selectedDate.toISOString();

    const response = await fetch(`${BACKEND_URL}/api/task/${row.original.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ due_date: formattedDate }),
    });

    if (!response.ok) {
      console.error("Failed to update due date");
      toast({ description: "Failed to update due date" });
    } else {
      toast({
        description: `Due date updated to ${formatDate(formattedDate)}`,
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {dueDate ? dueDate.toDateString() : "Set Due Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <Calendar mode="single" onSelect={(day) => handleDateChange(day)} />
      </PopoverContent>
    </Popover>
  );
}

export default DueDateCell;
