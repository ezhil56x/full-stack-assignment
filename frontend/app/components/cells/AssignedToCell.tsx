import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { UserCircle } from "lucide-react";
import { capFirstLetter } from "@/lib/utils";

function AssignedCell({ row }) {
  const initialAssignee = row.getValue("assignedTo") || "Unassigned";
  const [assignee, setAssignee] = useState(initialAssignee);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
      toast({ description: "Error fetching users" });
    } finally {
      setLoading(false);
    }
  };

  interface User {
    id: string;
    username: string;
    email: string;
  }

  const handleAssigneeChange = async (user: User) => {
    setAssignee(user.username);

    const response = await fetch(`${BACKEND_URL}/api/task/${row.original.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ assigned_to_id: user.id }),
    });

    if (!response.ok) {
      console.error("Failed to update assignee");
      toast({ description: "Failed to update assignee" });
    } else {
      toast({ description: `Assigned to ${capFirstLetter(user.username)}` });
    }
  };

  return (
    <DropdownMenu onOpenChange={fetchUsers}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          <UserCircle className="h-5 w-5 text-gray-500" />

          {assignee}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : users.length > 0 ? (
          users.map((user) => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => handleAssigneeChange(user)}
            >
              <UserCircle className="h-5 w-5 text-gray-500" />
              {capFirstLetter(user.username)}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No users found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AssignedCell;
