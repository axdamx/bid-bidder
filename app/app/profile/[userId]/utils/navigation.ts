/**
 * Utility functions for handling navigation in the profile page
 */

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Custom hook for handling navigation with loading state
 * @returns Navigation utilities and state
 */
export function useNavigation() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [pathname, isNavigating]);

  /**
   * Handle link click with navigation state
   * @param e Mouse event
   * @param path Path to navigate to
   */
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === pathname) return;
    setIsNavigating(true);
    router.push(path);
  };

  return {
    isNavigating,
    setIsNavigating,
    handleLinkClick,
    pathname,
    router
  };
}
