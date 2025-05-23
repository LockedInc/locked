import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  id: number;
  name: string;
}

interface SingleSelectProps {
  items: Item[];
  selectedId: number | null;
  onChange: (id: number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function SingleSelect({
  items,
  selectedId,
  onChange,
  placeholder = "Select...",
  label,
  error,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          onClick={() => setIsOpen((v) => !v)}
        >
          {selectedItem ? selectedItem.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="p-2 border-b">
              <Input
                type="text"
                placeholder="Search..."
                className="border-0 focus-visible:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center px-4 py-2 hover:bg-accent cursor-pointer",
                      selectedId === item.id && "bg-accent"
                    )}
                    onClick={() => {
                      setIsOpen(false);
                      onChange(item.id);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedId === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No items found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}