"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, User, Mail, Phone, Calendar, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { updateUserField } from "./action";
import { useRouter } from "next/navigation";
import LoadingButton from "@/app/components/LoadingButton";
import { useQueryClient } from "@tanstack/react-query";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";

const UserDetailsPage = ({ initialUser }) => {
  const [userData, setUserData] = useState(initialUser);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter
  // const queryClient = useQueryClient();
  const [, setUser] = useAtom(userAtom);

  // console.log("user dalam userDetails", user);

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
        toast.success(`${editingField} updated successfully`);
        setIsDialogOpen(false);
        router.refresh();
        // console.log("result.data", result.data);
        // this is for atom
        setUser((prev) => ({
          ...prev,
          [editingField]: editValue,
        }));
        // queryClient.invalidateQueries({ queryKey: ["user"] });
        // window.location.reload(); // Replace router.refresh() with this
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldConfig = {
    personal: {
      title: "Personal Information",
      description: "Manage your personal details",
      fields: {
        name: {
          label: "Name",
          type: "text",
          icon: <User className="h-4 w-4" />,
        },
        gender: {
          label: "Gender",
          type: "select",
          icon: <Users className="h-4 w-4" />,
        },
        birthday: {
          label: "Birthday",
          type: "date",
          icon: <Calendar className="h-4 w-4" />,
        },
      },
    },
    contact: {
      title: "Contact Information",
      description: "Manage your contact details",
      fields: {
        email: {
          label: "Email",
          type: "email",
          icon: <Mail className="h-4 w-4" />,
        },
        phone: {
          label: "Phone",
          type: "tel",
          icon: <Phone className="h-4 w-4" />,
        },
      },
    },
  };

  const renderEditDialog = () => {
    const config = Object.values(fieldConfig)
      .map((section) => section.fields)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})[editingField];

    if (!config) return null;

    return (
      <>
        <Toaster
          toastOptions={{ duration: 3000 }}
          position="bottom-right"
          reverseOrder={false}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit {config.label}</DialogTitle>
              <DialogDescription>
                Make changes to your {config.label.toLowerCase()}. Click save
                when you're done.
              </DialogDescription>
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
                      <SelectValue
                        placeholder={`Select ${config.label.toLowerCase()}`}
                      />
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
              {/* <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button> */}
              <LoadingButton
                isLoading={isLoading}
                onClick={handleSave}
                loadingText={"Saving..."}
                winnerText={"Done"}
                defaultText={"Save"}
                className="w-fit"
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  const renderField = (field, config) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 mb-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          {config.icon}
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">
            {config.label}
          </Label>
          <div className="font-medium">{userData[field] || "Not set"}</div>
        </div>
      </div>
      {field !== "email" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleEdit(field)}
          className="hover:bg-primary/10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            {Object.entries(fieldConfig).map(([key, section]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="space-y-2">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  {Object.entries(section.fields).map(([field, config]) => (
                    <div key={field}>{renderField(field, config)}</div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      {renderEditDialog()}
    </div>
  );
};

export default UserDetailsPage;
