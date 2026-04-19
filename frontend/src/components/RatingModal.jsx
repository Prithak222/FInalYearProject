import React, { useState } from 'react';
import { Star, X, Send, Loader2 } from 'lucide-react';

export function RatingModal({ order, isOpen, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return alert('Please select a rating');
        
        setSubmitting(true);
        try {
            await onSubmit({
                vendorId: order.vendorId,
                orderId: order._id,
                rating,
                comment
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rate Vendor</h3>
                        <p className="text-slate-500 text-sm font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-6">
                    {/* Stars */}
                    <div className="flex flex-col items-center justify-center space-y-3 py-4 bg-slate-50 rounded-3xl">
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none transition-transform active:scale-90"
                                >
                                    <Star 
                                        size={36} 
                                        className={`transition-all duration-300 ${
                                            (hover || rating) >= star 
                                                ? 'fill-amber-400 text-amber-400 scale-110' 
                                                : 'text-slate-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            {rating === 5 ? 'Excellent!' : 
                             rating === 4 ? 'Very Good' : 
                             rating === 3 ? 'Good' : 
                             rating === 2 ? 'Fair' : 
                             rating === 1 ? 'Poor' : 'Select a rating'}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Experience</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you liked about this vendor..."
                            className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-medium text-slate-700"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Submit Review</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
