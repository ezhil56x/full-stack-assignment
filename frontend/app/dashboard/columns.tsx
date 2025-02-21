"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, UserCircle } from "lucide-react";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updateAt: string;
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <UserCircle className="h-5 w-5 text-gray-500" />
        <span>{row.getValue("assignedTo")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const initialStatus = row.getValue("status") || "Pending"; // Default to "Pending"
      const [status, setStatus] = useState(initialStatus);

      const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        // Here, you can also update the data source or send an API request
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="capitalize">
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["Pending", "Completed", "In Progress"].map((option) => (
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
    },
  },

  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const initialPriority = row.getValue("priority") || "Low";
      const [priority, setPriority] = useState(initialPriority);

      const handlePriorityChange = (newPriority: string) => {
        setPriority(newPriority);
        // Here, you can also update the data source or send an API request
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
    },
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duedate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "updateAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
