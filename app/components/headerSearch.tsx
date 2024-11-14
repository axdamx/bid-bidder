"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchItems } from "../action";
import { CldImage } from "next-cloudinary";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  imageUrl?: string;
  currentBid: number;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false); // New state for loading
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 500); // Use the debounced query

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const items = await searchItems(debouncedQuery);
        setResults(items);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  // Add keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
      >
        <Search className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Search items...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search items..."
          value={query}
          onValueChange={setQuery}
        />
        <DialogTitle className="sr-only">Search items</DialogTitle>
        <CommandList className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <>
              <div className="px-4 py-2 text-sm text-gray-500">
                {results.length} item{results.length > 1 ? "s" : ""} found
              </div>
              <CommandGroup>
                {results.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.name}-${item.id}`} // Combine name and id for uniqueness while maintaining searchability
                    onSelect={() => {
                      router.push(`/items/${item.id}`);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {item.imageUrl ? (
                          <CldImage
                            width="64"
                            height="64"
                            src={item.imageUrl}
                            alt={item.name}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          // Fallback for when there's no image
                          <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                            <Search className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <span className="flex-grow truncate font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="flex-shrink-0 text-sm text-muted-foreground">
                      Current bid: {formatCurrency(item.currentBid)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
