import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  isLoading: boolean;
  isWinner?: boolean;
  onClick: () => void;
  loadingText: string;
  winnerText: string;
  defaultText: string;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  isWinner,
  onClick,
  loadingText,
  winnerText,
  defaultText,
  className,
}) => {
  return (
    <Button
      className={className || "w-full"} // Use w-full only if no className is provided
      disabled={isWinner || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : isWinner ? (
        winnerText
      ) : (
        defaultText
      )}
    </Button>
  );
};

export default LoadingButton;
