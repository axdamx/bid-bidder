import { Card } from "@/components/ui/card";

export const About = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {/* <User className="h-5 w-5 text-gray-500" /> */}
        <h2 className="text-lg font-semibold">About me</h2>
      </div>
      <p className="text-gray-700 mt-2">
        Big Boy is a big boy from KL. He is a big boy from KL.
      </p>
    </Card>
  );
};
