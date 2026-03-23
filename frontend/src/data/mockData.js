export const mockProducts = [
  {
    id: '1',
    title: 'iPhone 13 Pro - 128GB Graphite',
    price: 649,
    originalPrice: 999,
    condition: 'like-new',
    category: 'Electronics',
    location: 'San Francisco, CA',
    image:
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80',
    seller: {
      id: 'u1',
      name: 'Sarah Chen',
      verified: true,
      rating: 4.9,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    },
    description:
      'Excellent condition iPhone 13 Pro. Barely used, always kept in case. Battery health at 98%. Includes original box and charger.',
    postedDate: '2024-01-15',
    views: 234,
    saves: 18,
  },
  {
    id: '2',
    title: 'Herman Miller Aeron Chair - Size B',
    price: 495,
    originalPrice: 1395,
    condition: 'good',
    category: 'Furniture',
    location: 'Austin, TX',
    image:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    seller: {
      id: 'u2',
      name: 'Mike Johnson',
      verified: true,
      rating: 4.7,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    },
    description:
      'Authentic Herman Miller Aeron chair in good working condition. Some minor wear on armrests. Fully adjustable, very comfortable.',
    postedDate: '2024-01-14',
    views: 156,
    saves: 24,
  },
  {
    id: '3',
    title: 'Canon EOS R6 Camera Body',
    price: 1899,
    originalPrice: 2499,
    condition: 'like-new',
    category: 'Electronics',
    location: 'New York, NY',
    image:
      'https://images.unsplash.com/photo-1606980707986-8f6eedb6c18f?w=800&q=80',
    seller: {
      id: 'u3',
      name: 'Alex Rivera',
      verified: true,
      rating: 5.0,
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    },
    description:
      'Like new Canon EOS R6 with only 2,000 shutter actuations. Comes with original packaging, strap, and all accessories.',
    postedDate: '2024-01-13',
    views: 445,
    saves: 67,
  },
  {
    id: '4',
    title: 'Vintage Leather Jacket - Medium',
    price: 120,
    condition: 'good',
    category: 'Fashion',
    location: 'Portland, OR',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    seller: {
      id: 'u4',
      name: 'Emma Davis',
      verified: false,
      rating: 4.5,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    },
    description:
      'Genuine leather jacket from the 90s. Great vintage condition with natural patina. Fits like a modern medium.',
    postedDate: '2024-01-12',
    views: 89,
    saves: 12,
  },
  {
    id: '5',
    title: 'Nintendo Switch OLED - White',
    price: 280,
    originalPrice: 349,
    condition: 'like-new',
    category: 'Electronics',
    location: 'Seattle, WA',
    image:
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    seller: {
      id: 'u5',
      name: 'James Park',
      verified: true,
      rating: 4.8,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    },
    description:
      'OLED Switch in pristine condition. Includes dock, joy-cons, and original accessories. Screen protector applied since day one.',
    postedDate: '2024-01-11',
    views: 312,
    saves: 45,
  },
  {
    id: '6',
    title: 'Mid-Century Modern Coffee Table',
    price: 350,
    condition: 'good',
    category: 'Furniture',
    location: 'Los Angeles, CA',
    image:
      'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80',
    seller: {
      id: 'u6',
      name: 'Lisa Anderson',
      verified: true,
      rating: 4.6,
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80',
    },
    description:
      'Beautiful walnut coffee table from the 1960s. Some minor scratches but overall excellent condition. Real wood construction.',
    postedDate: '2024-01-10',
    views: 178,
    saves: 31,
  },
]

export const mockConversations = [
  {
    id: 'c1',
    productId: '1',
    productTitle: 'iPhone 13 Pro - 128GB Graphite',
    productImage:
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=200&q=80',
    otherUser: {
      id: 'u1',
      name: 'Sarah Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    },
    lastMessage: "Yes, it's still available! Would you like to meet up?",
    lastMessageTime: '2h ago',
    unread: 2,
  },
  {
    id: 'c2',
    productId: '2',
    productTitle: 'Herman Miller Aeron Chair',
    productImage:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200&q=80',
    otherUser: {
      id: 'u2',
      name: 'Mike Johnson',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    },
    lastMessage: 'Thanks for your interest! The chair is in great shape.',
    lastMessageTime: '1d ago',
    unread: 0,
  },
]

export const currentUser = {
  id: 'current',
  name: 'John Doe',
  email: 'john@example.com',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
  verified: true,
  rating: 4.8,
  memberSince: '2023-06-15',
  location: 'San Francisco, CA',
  bio: 'Tech enthusiast and sustainable living advocate. Love finding great deals on quality second-hand items!',
}

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', count: 1247 },
  { id: 'furniture', name: 'Furniture', icon: 'Armchair', count: 892 },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 2134 },
  { id: 'books', name: 'Books', icon: 'Book', count: 1567 },
  { id: 'sports', name: 'Sports & Outdoors', icon: 'Bike', count: 743 },
  { id: 'home', name: 'Home & Garden', icon: 'Home', count: 1089 },
  { id: 'toys', name: 'Toys & Games', icon: 'Gamepad2', count: 634 },
  { id: 'other', name: 'Other', icon: 'Package', count: 456 },
]
