"use client";

import * as React from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { User2, ImageIcon, X, Loader2, Send, Crown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { createClientSupabase } from "@/lib/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
// import { useSession } from "@/lib/supabase/SessionProvider";

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  itemId: string;
  imageUrl?: string;
}

interface ChatComponentProps {
  itemId: string;
  userId: string;
  userName: string;
  isActive?: boolean;
  itemOwnerId: string;
  onNewMessage?: (hasNewMessage: boolean) => void;
  existingMessages: Message[];
  isLoadingMessages: boolean;
}

export default function ChatComponent({
  itemId,
  userId,
  userName,
  isActive = true,
  itemOwnerId,
  onNewMessage,
  existingMessages,
  isLoadingMessages,
}: ChatComponentProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const supabase = createClientSupabase();

  console.log("existingMessages", existingMessages);

  // console.log("userId", userId);
  // console.log("itemOwnerId", itemOwnerId);
  const isOwner = userId === itemOwnerId; // Add this check

  React.useEffect(() => {
    setMessages(existingMessages);
  }, [existingMessages]);

  React.useEffect(() => {
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

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `chat-images/${itemId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("chat-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !isActive) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to send messages");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const messageData = {
        id: uuidv4(),
        content: newMessage.trim(),
        userId: session.user.id,
        userName,
        itemId: Number(itemId),
        createdAt: new Date().toISOString(),
        imageUrl,
      };

      const { error } = await supabase.from("chatMessages").insert(messageData);

      if (error) throw error;

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
    const date = new Date(timestamp);
    const now = new Date();
    const distance = formatDistanceToNow(date, { addSuffix: true });

    // If the message is from a different day, show the full date
    if (date.toDateString() !== now.toDateString()) {
      return `${format(date, "MMM d, yyyy")} at ${format(date, "h:mm a")}`;
    }

    // For messages from today, show relative time
    return distance;
  };

  if (!isActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center text-muted-foreground">
          This chat is only available during active bidding sessions.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto h-[600px] md:h-[700px] flex flex-col">
      {error && (
        <div className="flex items-center justify-center gap-2 p-2 bg-yellow-100 rounded-md">
          <span className="text-sm text-yellow-800">{error}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setError(null)}
            className="h-7 px-2"
          >
            Dismiss
          </Button>
        </div>
      )}
      <ScrollArea className="flex-grow p-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${
                message.userId === userId ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="w-12 h-12">
                {/* <AvatarImage src={message.imageUrl} alt="Avatar" /> */}
                <AvatarFallback>
                  {message.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col gap-1 max-w-[80%] ${
                  message.userId === userId ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.userId === userId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold mb-1 mt-1">
                    {message.userId === itemOwnerId ? (
                      <Crown className="h-4 w-4" />
                    ) : null}
                    {message.userName}
                  </div>
                  {message.imageUrl && (
                    <Image
                      src={message.imageUrl}
                      alt="Shared image"
                      className="max-w-full rounded-lg mb-2 cursor-pointer"
                      onClick={() => window.open(message.imageUrl, "_blank")}
                      width={300}
                      height={300}
                    />
                  )}
                  {message.content && (
                    <p className="text-sm break-words">{message.content}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mb-5">
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <CardContent className="p-4 border-t">
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
          <div className="relative inline-block mt-2 mb-4">
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
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            ref={fileInputRef}
          />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            disabled={isUploading}
            className="flex-1"
          />
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
