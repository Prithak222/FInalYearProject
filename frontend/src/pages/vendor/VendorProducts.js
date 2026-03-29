import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircleIcon, AlertCircleIcon, PackageIcon, PencilIcon, Trash2Icon } from 'lucide-react'

export function VendorProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            const token = sessionStorage.getItem('token')
            try {
                const res = await fetch('http://localhost:5000/api/products/vendor', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                } else {
                    setError('Failed to fetch your products')
                }
            } catch (err) {
                console.error(err)
                setError('Server error')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return
        }

        const token = sessionStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.ok) {
                setProducts(products.filter(p => p._id !== productId))
            } else {
                const data = await res.json()
                alert(data.message || 'Failed to delete product')
            }
        } catch (err) {
            console.error(err)
            alert('Server error while deleting')
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground">My Products</h1>
                    <Link
                        to="/vendor/post"
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        <span>Add Product</span>
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
                                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] font-bold text-primary uppercase mb-1">{product.category?.name || (typeof product.category === 'string' ? product.category : 'Uncategorized')}</p>
                                    <h3 className="font-bold text-slate-900 truncate mb-2">{product.title}</h3>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-black text-slate-900">Rs. {product.price}</span>
                                        <span className="text-[10px] font-medium text-slate-400 capitalize">{product.condition}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-4 border-t border-slate-100">
                                        <Link
                                            to={`/vendor/edit/${product._id}`}
                                            className="flex-1 flex items-center justify-center space-x-1 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-primary hover:text-white transition-all text-xs font-bold"
                                        >
                                            <PencilIcon className="w-3 h-3" />
                                            <span>Edit</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 flex items-center justify-center space-x-1 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                                        >
                                            <Trash2Icon className="w-3 h-3" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border rounded-2xl border-dashed border-slate-200">
                        <PackageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No products yet</h3>
                        <p className="text-slate-500 mb-6">Start selling by adding your first product.</p>
                        <Link
                            to="/vendor/post"
                            className="inline-flex items-center px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
                        >
                            List Your First Item
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
