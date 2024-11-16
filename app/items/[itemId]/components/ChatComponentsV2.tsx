"use client";

import { useEffect, useState, useRef } from "react";
import { User2, ImageIcon, X, Loader2, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientSupabase } from "@/lib/supabase/client";
import { io } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  itemId: string;
  imageUrl?: string;
}

export default function ChatComponentV2({
  itemId,
  userId,
  userName,
  isActive = true,
}: {
  itemId: string;
  userId: string;
  userName: string;
  isActive?: boolean;
}) {
  const supabase = createClientSupabase();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const socket = io("http://localhost:8082", {
    withCredentials: true,
  });

  // Fetch messages query
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chatMessages", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chatMessages")
        .select("*")
        .eq("itemId", itemId)
        .order("createdAt", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: isActive,
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `chat-images/${itemId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-images").getPublicUrl(filePath);

      return publicUrl;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      content,
      imageUrl,
    }: {
      content: string;
      imageUrl?: string;
    }) => {
      const messageData = {
        content: content.trim(),
        userId,
        userName,
        itemId,
        createdAt: new Date().toISOString(),
        imageUrl,
      };

      const { data, error } = await supabase
        .from("chatMessages")
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ["chatMessages", itemId],
        (old: Message[] = []) => [...old, newMessage]
      );
      socket.emit("chatMessage", { itemId, message: newMessage });
    },
  });

  // Socket connection effect
  useEffect(() => {
    if (!isActive) return;

    socket.emit("joinChat", itemId);

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chatMessage", (message: Message) => {
      if (message.userId !== userId) {
        queryClient.setQueryData(
          ["chatMessages", itemId],
          (old: Message[] = []) => [...old, message]
        );
      }
    });

    return () => {
      socket.emit("leaveChat", itemId);
      socket.off("chatMessage");
    };
  }, [itemId, isActive, userId, queryClient]);

  // Scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !isActive) return;

    setIsUploading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImageMutation.mutateAsync(selectedImage);
      }

      await sendMessageMutation.mutateAsync({ content: newMessage, imageUrl });

      setNewMessage("");
      setSelectedImage(null);
      setImagePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        `Failed to send message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isActive) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6 text-center text-muted-foreground">
          This chat is only available during active bidding sessions.
        </CardContent>
      </Card>
    );
  }

  // Rest of your existing UI code...
  return (
    <Card className="w-full max-w-4xl mx-auto">
      {!isConnected && error && (
        <div className="flex items-center justify-center gap-2 p-2 bg-yellow-100 rounded-md">
          <span className="text-sm text-yellow-800">Connection lost</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => socket.connect()}
            className="h-7 px-2"
          >
            Reconnect
          </Button>
        </div>
      )}

      <ScrollArea className="h-[400px] pr-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-4 ${
                message.userId === userId ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {message.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.userId === userId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                  <User2 className="h-4 w-4" />
                  {message.userName}
                </div>
                {message.imageUrl && (
                  <Image
                    src={message.imageUrl}
                    alt="Shared image"
                    className="max-w-full rounded-lg mb-2 cursor-pointer"
                    onClick={() => window.open(message.imageUrl, "_blank")}
                    width={500}
                    height={500}
                  />
                )}
                {message.content && (
                  <p className="break-words">{message.content}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {formatTimestamp(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} style={{ height: "1px" }} />
      </ScrollArea>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {imagePreviewUrl && (
        <div className="relative inline-block mt-2">
          <Image
            src={imagePreviewUrl}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-md"
            width={80}
            height={80}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={() => {
              setSelectedImage(null);
              setImagePreviewUrl(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
          disabled={isUploading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="submit" disabled={isUploading} className="min-w-[100px]">
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
