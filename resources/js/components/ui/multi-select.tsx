import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useCallback, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface Item {
    id: number
    name: string
}

interface MultiSelectProps {
    items?: Item[]
    selectedIds?: number[]
    onSelectionChange: (ids: number[]) => void
    placeholder?: string
    label?: string
    error?: string
}

export function MultiSelect({
    items = [],
    selectedIds = [],
    onSelectionChange,
    placeholder = "Select items...",
    label,
    error
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filteredItems, setFilteredItems] = useState<Item[]>(items)

    useEffect(() => {
        setFilteredItems(items)
    }, [items])

    const handleSearch = useCallback((searchTerm: string) => {
        const filtered = items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredItems(filtered)
    }, [items])

    const handleSelect = useCallback((itemId: number) => {
        const currentIds = [...selectedIds]
        const index = currentIds.indexOf(itemId)
        
        if (index === -1) {
            currentIds.push(itemId)
        } else {
            currentIds.splice(index, 1)
        }
        
        onSelectionChange(currentIds)
    }, [selectedIds, onSelectionChange])

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(prev => !prev)
    }

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium">{label}</label>}
            <div className="relative">
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between cursor-pointer"
                    onClick={handleDropdownToggle}
                >
                    {selectedIds.length > 0
                        ? `${selectedIds.length} items selected`
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                {isOpen && (
                    <div 
                        className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg"
                        onClick={handleDropdownClick}
                    >
                        <div className="p-2 border-b">
                            <Input 
                                type="text"
                                placeholder="Search..." 
                                className="border-0 focus-visible:ring-0"
                                onClick={handleDropdownClick}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                            {(filteredItems.length > 0 ? filteredItems : items).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center px-4 py-2 hover:bg-accent cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleSelect(item.id)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedIds.includes(item.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                    No items found.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {items
                        .filter(item => selectedIds.includes(item.id))
                        .map(item => (
                            <Badge key={item.id} variant="secondary">
                                {item.name}
                            </Badge>
                        ))}
                </div>
            )}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    )
} 