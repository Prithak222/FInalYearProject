import React, { useState } from 'react'
import { XIcon } from 'lucide-react'

export function FilterSidebar({ isOpen = true, onClose, onApply, initialFilters }) {
  const conditions = ['New', 'Like New', 'Good', 'Fair']
  const [priceRange, setPriceRange] = useState([initialFilters?.minPrice || 0, initialFilters?.maxPrice || 100000])
  const [selectedConditions, setSelectedConditions] = useState(initialFilters?.condition || [])
  const [selectedCategories, setSelectedCategories] = useState(initialFilters?.category || [])

  const [dbCategories, setDbCategories] = useState([])

  React.useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCategories(data)
        }
      })
      .catch(err => console.error('Error fetching categories in filter sidebar', err))
  }, [])

  const toggleCondition = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    )
  }

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const applyFilters = () => {
    onApply({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      condition: selectedConditions,
      category: selectedCategories,
    })

    onClose?.()
  }

  const clearFilters = () => {
    setPriceRange([0, 100000])
    setSelectedConditions([])
    setSelectedCategories([])

    onApply({
      minPrice: 0,
      maxPrice: 100000,
      condition: [],
      category: [],
    })
  }

  if (!isOpen) return null

  return (
    <div className="bg-white rounded-lg border border-border p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="md:hidden">
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Min (Rs.)</label>
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              placeholder="0"
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <span className="text-muted-foreground mt-5">–</span>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Max (Rs.)</label>
            <input
              type="number"
              min="0"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              placeholder="100000"
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3">Condition</h4>
        {conditions.map((condition) => (
          <label key={condition} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedConditions.includes(condition)}
              onChange={() => toggleCondition(condition)}
            />
            <span className="capitalize">{condition}</span>
          </label>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3">Categories</h4>
        {dbCategories.map((category) => (
          <label key={category._id} className="flex items-center gap-2 mb-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category._id)}
              onChange={() => toggleCategory(category._id)}
              className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{category.name}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <button
          onClick={applyFilters}
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="w-full py-2 bg-muted rounded-lg"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
