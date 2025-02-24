import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Trigger the search callback
  };

  return (
    <div className="flex justify-center my-10 w-full">
      <Input
        type="text"
        placeholder="Search wiki..."
        value={searchQuery}
        onChange={handleChange}
        className="w-1/2 p-4 text-lg"
      />
    </div>
  );
}
