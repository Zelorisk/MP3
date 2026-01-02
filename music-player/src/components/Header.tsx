import { Search } from "lucide-react";
import { useLibraryStore } from "../store/libraryStore";
import { useViewStore } from "../store/viewStore";

export const Header = () => {
  const { searchQuery, setSearchQuery } = useLibraryStore();
  const { currentView, setView } = useViewStore();

  const handleSearchFocus = () => {
    if (currentView !== "search") {
      setView("search");
    }
  };

  return (
    <div className="px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
      <div className="max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            className="w-full bg-surface/80 border border-tertiary text-primary placeholder-secondary rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>
      </div>
    </div>
  );
};
