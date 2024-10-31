"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserField } from "./action";

const UserDetailsPage = ({ initialUser }) => {
  const [userData, setUserData] = useState(initialUser);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(userData[field] || "");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserField(
        userData.id,
        editingField,
        editValue
      );

      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          [editingField]: editValue,
        }));
        toast({
          title: "Success",
          description: `${editingField} updated successfully`,
        });
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to update",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditDialog = () => {
    const fieldConfig = {
      name: {
        label: "Name",
        type: "text",
      },
      email: {
        label: "Email",
        type: "email",
      },
      phone: {
        label: "Phone",
        type: "tel",
      },
      gender: {
        label: "Gender",
        type: "select",
      },
      birthday: {
        label: "Birthday",
        type: "date",
      },
    };

    const config = fieldConfig[editingField];
    if (!config) return null;

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {config.label}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-field" className="text-right">
                {config.label}
              </Label>
              {config.type === "select" ? (
                <Select
                  value={editValue}
                  onValueChange={setEditValue}
                  disabled={isLoading}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="edit-field"
                  type={config.type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="col-span-3"
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderField = (field, label) => (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <Label className="text-sm text-gray-500">{label}</Label>
        <div className="text-lg">{userData[field] || "Not set"}</div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => handleEdit(field)}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 mb-5">
      <Card>
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
        </CardHeader>
        <CardContent>
          {renderField("name", "Username")}
          {renderField("email", "Email")}
          {renderField("phone", "Phone")}
          {renderField("gender", "Gender")}
          {renderField("birthday", "Birthday")}
        </CardContent>
      </Card>
      {renderEditDialog()}
    </div>
  );
};

export default UserDetailsPage;
