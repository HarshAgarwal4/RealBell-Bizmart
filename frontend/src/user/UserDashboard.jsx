import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartModal } from './CartModal';
import { ProductDetailModal } from './ProductDetailModal';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Store, 
  ChevronRight,
  CreditCard,
  Building2,
  LogOut,
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  Zap,
  Tag,
  CheckCircle2,
  X,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Images,
  PhoneCall,
  Menu,
  Heart,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Seed Catalog items with multiple distinct images for every product
const staticProducts = [
  {
    _id: "prod-1",
    id: 1,
    title: 'Men’s Ultra-Soft Bio-Washed Cotton Crew Neck T-Shirt',
    category: 'apparel',
    categoryLabel: 'Apparel & Garments',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80'
    ],
    price: 399,
    mrp: 899,
    discount: '56% off',
    rating: 4.8,
    reviews: 1420,
    delivery: 'FREE Delivery Tomorrow',
    badge: 'Bestseller',
    sellerName: 'Tirupur Knitwear Hub',
    shopName: 'Tirupur Knitwear Hub',
    unit: 'pcs',
    stock: 2500,
    leadTime: '1-2 Days',
    description: '100% Super combed bio-washed cotton, 180 GSM pre-shrunk fabric. Highly breathable, soft-flow dyed, and engineered for maximum durability and everyday comfort.'
  },
  {
    _id: "prod-2",
    id: 2,
    title: 'Premium Corporate Piqué Knit Polo T-Shirt (Embroidered)',
    category: 'uniforms',
    categoryLabel: 'Corporate Wear',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625910513413-7e4431940a02?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
    ],
    price: 499,
    mrp: 999,
    discount: '50% off',
    rating: 4.7,
    reviews: 980,
    delivery: 'FREE Delivery in 2 Days',
    badge: 'Top Rated',
    sellerName: 'Apex Workwear Mills',
    shopName: 'Apex Workwear Mills',
    unit: 'pcs',
    stock: 1800,
    leadTime: '2-3 Days',
    description: 'Heavyweight 220 GSM breathable piqué knit polo. Features reinforced collar bands, contrast horn buttons, and anti-shrink fabric finish.'
  },
  {
    _id: "prod-3",
    id: 3,
    title: 'Heavyweight Unisex Pullover Fleece Hoodie (Winter Edition)',
    category: 'apparel',
    categoryLabel: 'Winterwear',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e520028b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    price: 899,
    mrp: 1899,
    discount: '53% off',
    rating: 4.9,
    reviews: 2150,
    delivery: 'FREE Delivery Tomorrow',
    badge: 'Hot Deal',
    sellerName: 'Ludhiana Woolens Ltd',
    shopName: 'Ludhiana Woolens Ltd',
    unit: 'pcs',
    stock: 950,
    leadTime: '1-2 Days',
    description: '320 GSM brushed fleece cotton hoodie with double-needle stitch construction, kangaroo pouch pockets, and adjustable metal-tipped drawstrings.'
  },
  {
    _id: "prod-4",
    id: 4,
    title: 'Anti-Theft Waterproof Laptop Backpack with USB Port',
    category: 'bags',
    categoryLabel: 'Bags & Luggage',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80'
    ],
    price: 1199,
    mrp: 2499,
    discount: '52% off',
    rating: 4.8,
    reviews: 3410,
    delivery: 'FREE Delivery in 2 Days',
    badge: 'Trending',
    sellerName: 'Urban Gear Makers',
    shopName: 'Urban Gear Makers',
    unit: 'pcs',
    stock: 1400,
    leadTime: '1-2 Days',
    description: 'Constructed with tear-proof 900D Oxford nylon and hidden security zippers. Accommodates up to 15.6 inch laptops, ergonomic air-cushion back pads.'
  },
  {
    _id: "prod-5",
    id: 5,
    title: 'Double-Wall Vacuum Insulated Stainless Steel Thermal Flask 1L',
    category: 'drinkware',
    categoryLabel: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570533136641-42082aca90b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    price: 549,
    mrp: 1299,
    discount: '58% off',
    rating: 4.7,
    reviews: 890,
    delivery: 'FREE Delivery Tomorrow',
    badge: 'Bestseller',
    sellerName: 'Moradabad Metal Craft',
    shopName: 'Moradabad Metal Craft',
    unit: 'pcs',
    stock: 3200,
    leadTime: '1-2 Days',
    description: 'Crafted from food-grade SUS 304 stainless steel. Keeps hot beverages steaming for 18 hours and iced cold beverages chilled for 24 hours.'
  },
  {
    _id: "prod-6",
    id: 6,
    title: 'Eco-Friendly Heavy Duty Canvas Tote Bag with Zipper',
    category: 'bags',
    categoryLabel: 'Bags & Totes',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597484662317-c931206f0e74?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=800&q=80'
    ],
    price: 249,
    mrp: 599,
    discount: '58% off',
    rating: 4.6,
    reviews: 640,
    delivery: 'FREE Delivery in 3 Days',
    badge: 'Eco Friendly',
    sellerName: 'GreenLeaf Organics',
    shopName: 'GreenLeaf Organics',
    unit: 'pcs',
    stock: 4500,
    leadTime: '1-2 Days',
    description: '100% natural biodegradable 14oz unbleached cotton canvas. Features wide webbed handles and heavy-duty interior organization pockets.'
  },
  {
    _id: "prod-7",
    id: 7,
    title: 'All-Weather Industrial Steel-Toe Safety Work Boots',
    category: 'footwear',
    categoryLabel: 'Footwear & Safety',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    price: 1299,
    mrp: 2799,
    discount: '54% off',
    rating: 4.8,
    reviews: 1820,
    delivery: 'FREE Delivery Tomorrow',
    badge: 'ISI Certified',
    sellerName: 'Agra Footwear Syndicate',
    shopName: 'Agra Footwear Syndicate',
    unit: 'pairs',
    stock: 800,
    leadTime: '2-3 Days',
    description: 'CE and ISI certified buff leather safety boot equipped with 200J impact steel toe cap, penetration-resistant steel midsole, and oil-proof sole.'
  },
  {
    _id: "prod-8",
    id: 8,
    title: 'Executive Matte Black Metal Rollerball Pen & Case Gift Set',
    category: 'stationery',
    categoryLabel: 'Stationery & Gifts',
    image: 'https://images.unsplash.com/photo-1585336261026-6b2f15f013d9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585336261026-6b2f15f013d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585336261026-6b2f15f013d9?auto=format&fit=crop&w=800&q=80'
    ],
    price: 299,
    mrp: 699,
    discount: '57% off',
    rating: 4.9,
    reviews: 1120,
    delivery: 'FREE Delivery in 2 Days',
    badge: 'Premium Gift',
    sellerName: 'Noida Luxury Gifts',
    shopName: 'Noida Luxury Gifts',
    unit: 'sets',
    stock: 2200,
    leadTime: '1-2 Days',
    description: 'Solid brass body finished with tactile matte powder coating. Comes with high-flow German ceramic roller refill and hard-shell gift presentation case.'
  },
  {
    _id: "prod-9",
    id: 9,
    title: 'Premium Hardcover PU Leather Journal & Planner 2026',
    category: 'stationery',
    categoryLabel: 'Office Stationery',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'
    ],
    price: 349,
    mrp: 799,
    discount: '56% off',
    rating: 4.8,
    reviews: 840,
    delivery: 'FREE Delivery Tomorrow',
    badge: 'Top Rated',
    sellerName: 'Heritage Paper Co.',
    shopName: 'Heritage Paper Co.',
    unit: 'pcs',
    stock: 3100,
    leadTime: '1-2 Days',
    description: '192 numbered pages of 100 GSM acid-free ink-proof paper. Includes magnetic clasp lock, inner expandable document pocket, and ribbon markers.'
  },
  {
    _id: "prod-10",
    id: 10,
    title: 'Hospitality & Culinary Master Chef Apron with Utility Pockets',
    category: 'uniforms',
    categoryLabel: 'Kitchen Wear',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=800&q=80'
    ],
    price: 449,
    mrp: 899,
    discount: '50% off',
    rating: 4.7,
    reviews: 730,
    delivery: 'FREE Delivery in 2 Days',
    badge: 'Stain Proof',
    sellerName: 'ChefChoice Uniforms',
    shopName: 'ChefChoice Uniforms',
    unit: 'pcs',
    stock: 1200,
    leadTime: '1-2 Days',
    description: 'Teflon-coated water and oil resistant poly-cotton drill apron. Features criss-cross shoulder straps that prevent neck strain during long shifts.'
  },
  {
    _id: "prod-11",
    id: 11,
    title: 'High-Visibility Breathable Reflective Safety Vest with Pockets',
    category: 'footwear',
    categoryLabel: 'Safety Gear',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    ],
    price: 199,
    mrp: 499,
    discount: '60% off',
    rating: 4.6,
    reviews: 540,
    delivery: 'FREE Delivery Tomorrow',
    badge: 'High-Vis',
    sellerName: 'Suraksha Industrial Works',
    shopName: 'Suraksha Industrial Works',
    unit: 'pcs',
    stock: 5000,
    leadTime: '1-2 Days',
    description: 'ANSI/ISEA Class 2 compliant neon polyester mesh vest with 2-inch wide 3M micro-prismatic reflective tape for 360-degree night visibility.'
  },
  {
    _id: "prod-12",
    id: 12,
    title: 'Minimalist Ceramic Coffee Mug & Coaster Set (Matte Finish)',
    category: 'drinkware',
    categoryLabel: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    price: 299,
    mrp: 649,
    discount: '54% off',
    rating: 4.8,
    reviews: 910,
    delivery: 'FREE Delivery in 2 Days',
    badge: 'Handcrafted',
    sellerName: 'Khurja Pottery Arts',
    shopName: 'Khurja Pottery Arts',
    unit: 'sets',
    stock: 1600,
    leadTime: '1-2 Days',
    description: 'Lead-free microwave and dishwasher safe stoneware ceramic mug (350ml). Pair includes heat-insulated natural acacia wood coaster.'
  }
];

export const UserDashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const setIsCartOpen = useStore(state => state.setIsCartOpen);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('realbell_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('realbell_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('realbell_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // View Navigation: 'catalog' is the primary marketplace, 'orders' shows buyer purchases
  const [currentTab, setCurrentTab] = useState('catalog');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState(staticProducts);
  const [productsLoading, setProductsLoading] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Hover image index map for product cards
  const [cardHoverImg, setCardHoverImg] = useState({});

  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Dynamic Navbar Height Calculation (Guarantees sidebar top is never obscured by navbar or category subnav)
  const [navbarHeight, setNavbarHeight] = useState(148);

  useEffect(() => {
    const updateNavHeight = () => {
      const navEl = document.getElementById('app-navbar') || document.querySelector('header');
      if (navEl) {
        setNavbarHeight(navEl.offsetHeight);
      }
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchBackendProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await axios.get('/user/orders');
      if (res.status === 200 && res.data.status === 1) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchBackendProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await axios.get('/products');
      if (res.status === 200 && res.data.status === 1 && Array.isArray(res.data.products)) {
        if (res.data.products.length > 0) {
          const formattedBackend = res.data.products.map(p => ({
            _id: p._id,
            id: p._id,
            title: p.title,
            category: p.category || 'apparel',
            categoryLabel: p.categoryLabel || 'Marketplace Item',
            image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
            images: (p.images && p.images.length > 0) ? p.images : [
              (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
            ],
            price: p.price,
            mrp: p.mrp || Math.round(p.price * 1.8),
            discount: p.mrp ? `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off` : 'Special Deal',
            rating: p.rating || 4.8,
            reviews: p.reviews || 320,
            delivery: 'FREE Delivery in 2-3 Days',
            badge: p.badge || 'Verified Seller',
            sellerName: p.sellerName || p.shopName || 'Verified Merchant',
            shopName: p.shopName || 'Direct Marketplace Shop',
            unit: p.unit || 'pcs',
            stock: p.stock || 500,
            leadTime: p.leadTime || '1-2 Days',
            description: p.description || ''
          }));

          const combined = [...formattedBackend];
          staticProducts.forEach(sp => {
            if (!combined.some(cp => cp.title === sp.title)) {
              combined.push(sp);
            }
          });
          setProducts(combined);
        }
      }
    } catch (err) {
      console.log("Using rich static product base", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleAddToCart = (product, qty = 1) => {
    addToCart({
      _id: String(product._id || product.id),
      title: product.title,
      price: product.price,
      quantity: qty,
      image: (product.images && product.images[0]) || product.image,
      unit: product.unit || 'pcs',
      sellerName: product.sellerName || product.shopName || 'Verified Seller'
    }, qty);
  };

  const handleBuyNow = (product, qty = 1) => {
    addToCart({
      _id: String(product._id || product.id),
      title: product.title,
      price: product.price,
      quantity: qty,
      image: (product.images && product.images[0]) || product.image,
      unit: product.unit || 'pcs',
      sellerName: product.sellerName || product.shopName || 'Verified Seller'
    }, qty);
    setIsCartOpen(true);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // Categories list
  const categoriesList = [
    { id: 'all', name: 'All Categories' },
    { id: 'apparel', name: 'Apparel & Garments' },
    { id: 'uniforms', name: 'Corporate Uniforms' },
    { id: 'bags', name: 'Bags & Luggage' },
    { id: 'stationery', name: 'Stationery & Gifts' },
    { id: 'drinkware', name: 'Drinkware & Bottles' },
    { id: 'footwear', name: 'Footwear & Safety' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesCat = (p.categoryLabel || '').toLowerCase().includes(query);
        const matchesSeller = (p.sellerName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCat && !matchesSeller) return false;
      }

      if (priceRange === 'under300' && p.price >= 300) return false;
      if (priceRange === '300-500' && (p.price < 300 || p.price > 500)) return false;
      if (priceRange === '500-1000' && (p.price < 500 || p.price > 1000)) return false;
      if (priceRange === 'above1000' && p.price <= 1000) return false;

      if (ratingFilter === '4.5' && (p.rating || 0) < 4.5) return false;
      if (ratingFilter === '4.0' && (p.rating || 0) < 4.0) return false;

      if (inStockOnly && p.stock !== undefined && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'discount') {
        const discA = a.mrp ? ((a.mrp - a.price) / a.mrp) : 0;
        const discB = b.mrp ? ((b.mrp - b.price) / b.mrp) : 0;
        return discB - discA;
      }
      return 0;
    });
  }, [products, selectedCategory, searchTerm, priceRange, ratingFilter, inStockOnly, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + 
                             (priceRange !== 'all' ? 1 : 0) + 
                             (ratingFilter !== 'all' ? 1 : 0) + 
                             (inStockOnly ? 1 : 0) + 
                             (searchTerm ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setRatingFilter('all');
    setInStockOnly(false);
    setSearchTerm('');
    setSortBy('featured');
  };

  // Orders metrics for the Orders tab
  const activeOrdersCount = orders.filter(o => ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(o.orderStatus)).length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'delivered').length;
  const totalSpent = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-theme-page font-poppins text-theme-main flex flex-col transition-colors duration-200">
      
      {/* 1. Global Platform Navbar */}
      <Navbar 
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentTab('catalog');
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Main Dashboard Workspace (Content on Right, Fixed Sidebar on Left) */}
      <div className="flex-1 w-full flex flex-col min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:pl-[352px] lg:pr-8 py-6 flex-1">
          <main className="w-full space-y-5">

            {/* VIEW 1: MARKETPLACE CATALOG (NO ORDER BUTTONS) */}
            {currentTab === 'catalog' && (
              <div className="space-y-4">
                
                {/* Search & Sorting Toolbar */}
                <div className="bg-theme-card border border-theme-border rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products by title, category, or seller..."
                        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-theme-border bg-theme-page text-theme-main placeholder:text-theme-muted focus:outline-hidden focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-main"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Toolbar Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Mobile Filter Drawer Button */}
                      <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(true)}
                        className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-theme-border bg-theme-page text-xs font-semibold text-theme-main cursor-pointer"
                      >
                        <Filter className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Filters</span>
                        {activeFiltersCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-slate-950 font-bold text-[10px] flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </button>

                      {/* Sorting Dropdown */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-xs font-semibold text-theme-main focus:outline-hidden focus:border-[#F59E0B] cursor-pointer"
                        >
                          <option value="featured">Featured Deals</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                          <option value="discount">Biggest Discount</option>
                        </select>
                      </div>

                      {/* View Mode Grid/List Toggle */}
                      <div className="hidden sm:flex items-center p-0.5 rounded-xl border border-theme-border bg-theme-page">
                        <button
                          type="button"
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            viewMode === 'grid' ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs' : 'text-theme-muted hover:text-theme-main'
                          }`}
                          title="Grid View"
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            viewMode === 'list' ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs' : 'text-theme-muted hover:text-theme-main'
                          }`}
                          title="List View"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Active Filters Row */}
                  {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-theme-border text-xs">
                      <span className="text-[11px] font-semibold text-theme-muted mr-1">Active:</span>
                      
                      {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-theme-page text-theme-main text-[11px] font-medium border border-theme-border">
                          Category: {categoriesList.find(c => c.id === selectedCategory)?.name || selectedCategory}
                          <button onClick={() => setSelectedCategory('all')} className="hover:text-[#F59E0B] cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {priceRange !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-theme-page text-theme-main text-[11px] font-medium border border-theme-border">
                          Price: {priceRange}
                          <button onClick={() => setPriceRange('all')} className="hover:text-[#F59E0B] cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {ratingFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-theme-page text-theme-main text-[11px] font-medium border border-theme-border">
                          {ratingFilter}★ & Up
                          <button onClick={() => setRatingFilter('all')} className="hover:text-[#F59E0B] cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {inStockOnly && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-theme-page text-theme-main text-[11px] font-medium border border-theme-border">
                          In Stock Only
                          <button onClick={() => setInStockOnly(false)} className="hover:text-[#F59E0B] cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-theme-page text-theme-main text-[11px] font-medium border border-theme-border">
                          "{searchTerm}"
                          <button onClick={() => setSearchTerm('')} className="hover:text-[#F59E0B] cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-[11px] font-semibold text-[#F59E0B] hover:underline ml-auto cursor-pointer"
                      >
                        Reset All
                      </button>
                    </div>
                  )}

                  {/* Summary Count Bar */}
                  <div className="flex items-center justify-between text-xs text-theme-muted">
                    <span>
                      Showing <strong className="text-theme-main font-bold">{filteredProducts.length}</strong> of <strong className="text-theme-main font-bold">{products.length}</strong> Products
                    </span>
                    <span className="text-[11px] hidden sm:inline">
                      Click any product to inspect multiple photos & technical specifications
                    </span>
                  </div>
                </div>

                {/* Product Cards Layout */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-theme-card border border-theme-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-theme-page text-theme-muted flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-theme-main">No products found</h3>
                      <p className="text-xs text-theme-muted mt-1">
                        Try adjusting your keywords or clearing selected filters.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-4 py-2 rounded-xl bg-[#F59E0B] text-slate-950 font-bold text-xs transition cursor-pointer hover:bg-[#D97706]"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4"
                      : "space-y-3"
                  }>
                    {filteredProducts.map((prod) => {
                      const prodId = prod._id || prod.id;
                      const imagesList = (prod.images && prod.images.length > 0) ? prod.images : [prod.image];
                      const activeImgIndex = cardHoverImg[prodId] !== undefined ? cardHoverImg[prodId] : 0;
                      const activeImg = imagesList[activeImgIndex] || prod.image;

                      const discountVal = prod.mrp && prod.price && prod.mrp > prod.price 
                        ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) 
                        : (prod.discount ? parseInt(prod.discount) : 0);

                      if (viewMode === 'list') {
                        // Compact List View
                        return (
                          <div
                            key={prodId}
                            className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                          >
                            <div 
                              onClick={() => handleOpenDetail(prod)}
                              className="flex items-center gap-4 cursor-pointer flex-1"
                            >
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-theme-page shrink-0 border border-theme-border">
                                <img src={activeImg} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                {imagesList.length > 1 && (
                                  <span className="absolute bottom-1 right-1 bg-[#1A1008]/85 text-[#EAD9C4] dark:text-[#EAD9C4] text-[9px] font-bold px-1 rounded">
                                    +{imagesList.length}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-[#D97706] dark:text-[#F59E0B] uppercase tracking-wider">
                                    {prod.categoryLabel || prod.category}
                                  </span>
                                  {prod.badge && (
                                    <span className="text-[10px] font-semibold bg-theme-page text-theme-muted px-2 py-0.5 rounded border border-theme-border">
                                      {prod.badge}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold text-xs sm:text-sm text-theme-main line-clamp-1 group-hover:text-[#F59E0B] transition">
                                  {prod.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-theme-muted">
                                  <div className="flex items-center text-[#F59E0B] font-bold">
                                    <Star className="w-3 h-3 fill-[#F59E0B] mr-0.5" />
                                    <span>{prod.rating || 4.8}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{prod.sellerName || 'Verified Wholesaler'}</span>
                                  <span>•</span>
                                  <span className="text-emerald-500 font-semibold">{prod.delivery}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme-border">
                              <div className="text-left sm:text-right">
                                <div className="text-sm sm:text-base font-bold text-theme-main">
                                  ₹{Number(prod.price).toLocaleString('en-IN')}
                                </div>
                                {prod.mrp && (
                                  <span className="text-xs text-theme-muted line-through">
                                    ₹{Number(prod.mrp).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(prod)}
                                  className="px-3 py-2 rounded-xl border border-theme-border hover:bg-black/5 dark:hover:bg-[#EAD9C4]/5 text-xs font-semibold text-theme-main transition cursor-pointer"
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(prod)}
                                  className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Modern Clean Grid Card with Multi-Image Support
                      return (
                        <div
                          key={prodId}
                          className="bg-theme-card border border-theme-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#F59E0B]/50 transition-all duration-200 flex flex-col group"
                        >
                          {/* Image Container with Multiple Images Switcher */}
                          <div className="relative aspect-4/3 overflow-hidden bg-theme-page">
                            <img
                              src={activeImg}
                              alt={prod.title}
                              onClick={() => handleOpenDetail(prod)}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-104 cursor-pointer"
                            />
                            
                            {/* Top Badges */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                              {discountVal > 0 && (
                                <span className="bg-[#E11D48] text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                                  {discountVal}% OFF
                                </span>
                              )}
                            </div>

                            {/* Multiple Photos Count Badge */}
                            {imagesList.length > 1 && (
                              <div className="absolute top-2.5 right-2.5 bg-[#160D06]/80 backdrop-blur-xs text-[#EAD9C4] text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 shadow-xs pointer-events-none">
                                <Images className="w-3 h-3 text-[#F59E0B]" />
                                <span>{imagesList.length} Photos</span>
                              </div>
                            )}

                            {/* Multiple Images Dots Switcher on Hover */}
                            {imagesList.length > 1 && (
                              <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                                {imagesList.map((_, dotIdx) => (
                                  <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCardHoverImg(prev => ({ ...prev, [prodId]: dotIdx }));
                                    }}
                                    className={`w-2 h-2 rounded-full transition cursor-pointer ${
                                      activeImgIndex === dotIdx 
                                        ? 'bg-[#F59E0B] w-4 shadow-xs' 
                                        : 'bg-white/70 hover:bg-white'
                                    }`}
                                    title={`View angle ${dotIdx + 1}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Card Content Area */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-1.5">
                              {/* Category and Rating */}
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[#D97706] dark:text-[#F59E0B] font-bold uppercase tracking-wider">
                                  {prod.categoryLabel || prod.category}
                                </span>
                                <div className="flex items-center gap-1 font-semibold text-theme-main">
                                  <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                                  <span>{prod.rating || 4.8}</span>
                                  <span className="text-[10px] text-theme-muted">({prod.reviews || 420})</span>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 
                                onClick={() => handleOpenDetail(prod)}
                                className="font-bold text-xs sm:text-sm text-theme-main line-clamp-2 leading-snug hover:text-[#F59E0B] transition cursor-pointer"
                              >
                                {prod.title}
                              </h3>

                              {/* Seller */}
                              <div className="flex items-center gap-1 text-[11px] text-theme-muted">
                                <Store className="w-3 h-3 text-theme-muted shrink-0" />
                                <span className="truncate">{prod.sellerName || 'Verified Merchant'}</span>
                              </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="pt-2 border-t border-theme-border space-y-2">
                              <div className="flex items-baseline justify-between">
                                <div>
                                  <span className="text-base font-bold text-theme-main">
                                    ₹{Number(prod.price).toLocaleString('en-IN')}
                                  </span>
                                  {prod.mrp && (
                                    <span className="text-xs text-theme-muted line-through ml-1.5">
                                      ₹{Number(prod.mrp).toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-medium text-emerald-500">
                                  Free Express
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(prod)}
                                  className="py-1.5 px-2 rounded-xl border border-theme-border hover:bg-black/5 dark:hover:bg-white/5 text-theme-main text-xs font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5 text-theme-muted" />
                                  <span>Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(prod)}
                                  className="py-1.5 px-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5 text-slate-950" />
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* VIEW 2: MY ORDERS (SHOWN ONLY ON CLICKING 'MY ORDERS' IN SIDEBAR) */}
            {currentTab === 'orders' && (
              <div className="space-y-5">
                
                {/* Orders Statistics Cards (Shown ONLY in Orders View) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-theme-muted mb-1">
                      <span className="text-[11px] font-semibold">Total Orders</span>
                      <Package className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-theme-main">{orders.length}</div>
                    <div className="text-[10px] text-theme-muted">Purchase bookings</div>
                  </div>

                  <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-theme-muted mb-1">
                      <span className="text-[11px] font-semibold">In Transit</span>
                      <Truck className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-500 dark:text-blue-400">{activeOrdersCount}</div>
                    <div className="text-[10px] text-theme-muted">Active shipments</div>
                  </div>

                  <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-theme-muted mb-1">
                      <span className="text-[11px] font-semibold">Delivered</span>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-500">{completedOrdersCount}</div>
                    <div className="text-[10px] text-theme-muted">Fulfilled packages</div>
                  </div>

                  <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-theme-muted mb-1">
                      <span className="text-[11px] font-semibold">Total Spent</span>
                      <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-[#F59E0B]">
                      ₹{totalSpent.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-theme-muted">Razorpay Verified</div>
                  </div>
                </div>

                {/* Orders Content Card */}
                <div className="bg-theme-card border border-theme-border rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                    <div>
                      <h2 className="text-base font-bold text-theme-main">Order History & Deliveries</h2>
                      <p className="text-xs text-theme-muted">
                        Real-time status updates and delivery tracking for your marketplace orders
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('catalog')}
                      className="text-xs font-semibold text-[#F59E0B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="text-center py-10">
                      <div className="w-7 h-7 border-3 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-theme-muted">Loading purchase records...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-theme-border rounded-xl p-6 space-y-3">
                      <Package className="w-10 h-10 text-theme-muted mx-auto" />
                      <div>
                        <h4 className="text-xs font-bold text-theme-main">No Orders Placed Yet</h4>
                        <p className="text-xs text-theme-muted mt-0.5">
                          Browse thousands of verified products from direct manufacturers.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentTab('catalog')}
                        className="px-4 py-2 rounded-xl bg-[#F59E0B] text-slate-950 font-bold text-xs hover:bg-[#D97706] transition shadow-xs cursor-pointer inline-flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Start Shopping</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {orders.map((order, idx) => (
                        <div key={order._id} className={`py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${idx > 0 ? 'border-t border-theme-border' : ''}`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-theme-main">#{order.orderNumber}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                                order.orderStatus === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 dark:text-emerald-300' :
                                order.orderStatus === 'processing' ? 'bg-[#F59E0B]/15 text-[#D97706] dark:text-[#F59E0B]' :
                                'bg-blue-500/15 text-blue-500 dark:text-blue-400'
                              }`}>
                                {order.orderStatus.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[11px] text-theme-muted">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-xs text-theme-muted">
                              {order.items?.length || 0} item(s) • Total: <strong className="text-theme-main">₹{Number(order.totalAmount).toLocaleString('en-IN')}</strong> • Paid via {order.paymentMethod?.toUpperCase()}
                            </p>
                          </div>

                          <button
                            onClick={() => navigate(`/user/track-order/${order._id}`)}
                            className="bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-xs font-semibold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-theme-main"
                          >
                            <Truck className="w-3.5 h-3.5 text-blue-400" />
                            <span>Track Order</span>
                            <ChevronRight className="w-3 h-3 text-theme-muted" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>

        {/* 3. Platform Footer (z-40 priority over sidebar) */}
        <Footer />
      </div>

      {/* ===================== 4. TRULY FIXED LEFT SIDEBAR (Behind Navbar z-50 & Footer z-40) ===================== */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#160D06]/80 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside 
        style={{
          top: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${navbarHeight}px` : undefined,
          height: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `calc(100vh - ${navbarHeight}px)` : undefined
        }}
        className={`sidebar-scroll fixed inset-y-0 left-0 z-50 w-80 bg-theme-sidebar border-r border-theme-border p-5 overflow-y-auto shadow-xs transition-transform duration-300 lg:top-[148px] lg:bottom-0 lg:z-20 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between lg:hidden mb-4 pb-2 border-b border-theme-border">
          <span className="font-semibold text-xs text-theme-main uppercase tracking-wider">Navigation Menu</span>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-theme-muted hover:text-theme-main hover:bg-[#EAD9C4]/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-theme-card border border-theme-border mb-5 shadow-xs">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : 'H'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-theme-sidebar"></span>
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <h3 className="font-bold text-xs text-theme-main truncate">
              {user?.name || 'Harsh Agarwal'}
            </h3>
            <p className="text-[11px] text-theme-muted truncate">
              {user?.email || 'agarwalh270@gmail.com'}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Buyer Account
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-1 mb-5">
          <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wider px-2 mb-1.5">
            Dashboard Menu
          </div>

          {/* 1. Marketplace Catalog Tab */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('catalog');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'catalog'
                ? 'bg-[#F59E0B] text-white shadow-xs font-bold'
                : 'text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace Catalog</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
              currentTab === 'catalog' ? 'bg-white/25 text-white' : 'bg-theme-card text-theme-muted border border-theme-border'
            }`}>
              {products.length}
            </span>
          </button>

          {/* 2. My Orders Tab */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('orders');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'orders'
                ? 'bg-[#F59E0B] text-white shadow-xs font-bold'
                : 'text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            {orders.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                currentTab === 'orders' ? 'bg-white/25 text-white' : 'bg-theme-card text-theme-muted border border-theme-border'
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          {/* 3. My Cart Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-[#F59E0B]" />
              <span>Cart & Checkout</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
              {cart.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} items
            </span>
          </button>

          {/* 4. Become a Seller */}
          <Link
            to="/seller/apply"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 transition group"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-theme-muted group-hover:text-[#F59E0B] transition" />
              <span>Become a Seller</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-theme-muted group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Sidebar Filter Controls */}
        {currentTab === 'catalog' && (
          <div className="pt-4 border-t border-theme-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#F59E0B] hover:underline font-semibold cursor-pointer"
                >
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-theme-main block mb-1">
                Category
              </label>
              {categoriesList.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-theme-card text-theme-main font-bold border border-theme-border shadow-xs'
                        : 'text-theme-muted hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 hover:text-theme-main font-medium'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-xs shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Price Budget */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-theme-main block mb-1">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under300', label: '< ₹300' },
                  { id: '300-500', label: '₹300 - ₹500' },
                  { id: '500-1000', label: '₹500 - ₹1K' },
                  { id: 'above1000', label: '₹1K+' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriceRange(p.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition border cursor-pointer ${
                      priceRange === p.id
                        ? 'bg-[#F59E0B] text-white font-bold border-transparent shadow-xs'
                        : 'border-theme-border bg-theme-card text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-theme-main block mb-1">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: '4.5', label: '4.5★+' },
                  { id: '4.0', label: '4.0★+' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRatingFilter(r.id)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition border cursor-pointer ${
                      ratingFilter === r.id
                        ? 'bg-[#F59E0B] text-white font-bold border-transparent shadow-xs'
                        : 'border-theme-border bg-theme-card text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-theme-main select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#F59E0B] focus:ring-[#F59E0B] border-theme-border cursor-pointer accent-[#F59E0B]"
                />
                <span className="font-medium text-[11px]">In Stock Only</span>
              </label>
            </div>
          </div>
        )}

        {/* Sidebar Footer: Trust Note & Sign Out */}
        <div className="pt-5 mt-5 border-t border-theme-border space-y-2.5">
          <div className="p-2.5 rounded-xl bg-theme-card border border-theme-border text-[11px] text-theme-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="leading-tight">All payments secured by Razorpay Escrow</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 5. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* 6. Global Cart & Checkout Modal */}
      <CartModal />

    </div>
  );
};
