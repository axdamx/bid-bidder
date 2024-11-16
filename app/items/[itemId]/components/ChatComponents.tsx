"use client";

import { useEffect, useState, useRef } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { User2, ImageIcon, X, Loader2, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientSupabase } from "@/lib/supabase/client";
import { supabase } from "@/lib/utils";

// Initialize Supabase client
// const supabase = createClient('your-supabase-url', 'your-anon-key')

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  itemId: string;
  imageUrl?: string;
}

export default function ChatComponent({
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryTimeout = useRef<NodeJS.Timeout>();
  const [isConnected, setIsConnected] = useState(false);
  //   const supabase = createClientSupabase();

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    console.log("Supabase client initialized:", !!supabase);
    console.log("ItemId:", itemId);
    console.log("UserId:", userId);
    console.log("IsActive:", isActive);
    console.log("UserName:", userName);
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Current user:", user);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("chatMessages")
          .select("*")
          .eq("itemId", itemId)
          .order("createdAt", { ascending: true });

        if (error) throw error;
        if (mounted) {
          setIsLoading(false);
          setMessages(data || []);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        if (mounted) {
          setError("Failed to load messages");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const setupSubscription = () => {
      // Only set up subscription if it doesn't exist
      if (!channelRef.current) {
        console.log("Setting up new subscription");
        channelRef.current = supabase
          .channel(`item-${itemId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "chatMessages",
              filter: `itemId=eq.${itemId}`,
            },
            (payload) => {
              console.log("Received real-time message:", payload);
              if (mounted) {
                setMessages((current) => {
                  const newMessage = payload.new as Message;
                  const isDuplicate = current.some(
                    (msg) => msg.id === newMessage.id
                  );
                  if (isDuplicate) {
                    console.log("Duplicate message detected, skipping...");
                    return current;
                  }
                  return [...current, newMessage];
                });
              }
            }
          )
          .subscribe((status) => {
            if (!mounted) return;
            console.log("Subscription status:", status);
            setIsConnected(status === "SUBSCRIBED");
          });
      }
    };

    fetchMessages();
    setupSubscription();

    // Only cleanup on component unmount
    return () => {
      mounted = false;
    };
  }, [itemId]); // Remove isActive from dependencies
  useEffect(() => {
    const handleUnload = () => {
      if (channelRef.current) {
        console.log("Unsubscribing from channel due to page unload");
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (channelRef.current) {
        console.log("Unsubscribing from channel due to component unmount");
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []); // Empty dependency array as this should only run on mount/unmount

  // Add a reconnect button for manual reconnection
  const handleReconnect = () => {
    setRetryCount(0);
    setError(null);
  };

  // Add this to your JSX where appropriate
  const renderConnectionStatus = () => {
    if (!isConnected && error) {
      return (
        <div className="flex items-center justify-center gap-2 p-2 bg-yellow-100 rounded-md">
          <span className="text-sm text-yellow-800">Connection lost</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReconnect}
            className="h-7 px-2"
          >
            Reconnect
          </Button>
        </div>
      );
    }
    return null;
  };

  //   useEffect(() => {
  //     if (scrollAreaRef.current) {
  //       scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  //     }
  //   }, [messages]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
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
    e.preventDefault(); // Keep only one preventDefault
    if ((!newMessage.trim() && !selectedImage) || !isActive) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to send messages");
      return;
    }

    console.log("Attempting to send message");
    setIsUploading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (selectedImage) {
        console.log("Uploading image");
        imageUrl = await uploadImage(selectedImage);
        console.log("Image uploaded:", imageUrl);
      }

      const messageData = {
        content: newMessage.trim(),
        userId: session.user.id,
        userName,
        itemId: Number(itemId),
        createdAt: new Date().toISOString(),
        imageUrl,
      };

      console.log("Sending message data:", messageData);

      const { data, error } = await supabase
        .from("chatMessages")
        .insert(messageData)
        .select();

      if (error) throw error;

      console.log("Message sent successfully:", data);

      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {renderConnectionStatus()}
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
