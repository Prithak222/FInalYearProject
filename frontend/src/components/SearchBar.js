import React, { useState } from 'react'
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react'

export function SearchBar({
  onSearch,
  onFilterClick,
  placeholder = 'Search for items...',
}) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-lg border border-transparent focus:border-ring focus:outline-none focus:bg-white transition-colors text-sm"
        />
      </div>

      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center justify-center w-10 h-10 bg-muted hover:bg-accent rounded-lg transition-colors"
        >
          <SlidersHorizontalIcon className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </form>
  )
}
