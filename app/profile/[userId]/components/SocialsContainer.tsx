import { Card } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  LinkedinIcon,
} from "lucide-react";

export const SocialLinks = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {/* <Share2 className="h-5 w-5 text-gray-500" /> */}
        <h1 className="text-lg font-semibold">Social Links</h1>
      </div>
      <div className="flex space-x-4 mt-2">
        <Facebook className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
        <Instagram className="h-5 w-5 text-gray-500 hover:text-pink-600 cursor-pointer" />
        <Twitter className="h-5 w-5 text-gray-500 hover:text-blue-400 cursor-pointer" />
        <Youtube className="h-5 w-5 text-gray-500 hover:text-red-600 cursor-pointer" />
        <LinkedinIcon className="h-5 w-5 text-gray-500 hover:text-blue-700 cursor-pointer" />
      </div>
    </Card>
  );
};
