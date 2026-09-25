import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SourcingAssistant from '../components/SourcingAssistant';
import { CartModal } from '../user/CartModal';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
import { ProductCardSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Layers, 
  Search, 
  Store, 
  Globe2, 
  Star, 
  TrendingUp, 
  Clock, 
  PhoneCall, 
  ChevronRight,
  PackageCheck,
  Zap,
  Check,
  ShoppingCart,
  ShoppingBag,
  RotateCcw,
  CreditCard,
  Heart,
  HelpCircle,
  Headphones,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for smooth scroll reveals
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Home = () => {
  const navigate = useNavigate();

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
  
  // User and Cart Store
  const user = useStore(state => state.user);
  const addToCart = useStore(state => state.addToCart);
  const setIsCartOpen = useStore(state => state.setIsCartOpen);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    withSkeletonDelay().then(() => {
      setCatalogLoading(false);
    });
  }, []);

  // Direct Marketplace Add To Cart Handler
  const handleAddToCart = (prod) => {
    if (!user) {
      toast.info("Please sign in to add products to your cart");
      navigate('/login');
      return;
    }
    addToCart({
      _id: String(prod.id),
      title: prod.title,
      price: prod.price,
      quantity: 1,
      image: prod.image,
      unit: 'pc'
    });
    setIsCartOpen(true);
    toast.success(`Added "${prod.title}" to cart!`);
  };

  const handleBuyNow = (prod) => {
    if (!user) {
      toast.info("Please sign in to order products");
      navigate('/login');
      return;
    }
    addToCart({
      _id: String(prod.id),
      title: prod.title,
      price: prod.price,
      quantity: 1,
      image: prod.image,
      unit: 'pc'
    });
    setIsCartOpen(true);
  };

  // Enterprise client brands
  const clientBrands = [
    { name: 'Amazon', role: 'Verified Seller Partner' },
    { name: 'Swiggy', role: 'Fleet Merchandise' },
    { name: 'Aprilia', role: 'Official Apparel' },
    { name: 'Tata', role: 'Corporate Workwear' },
    { name: 'Delhivery', role: 'Logistics Partner' },
    { name: 'Zepto', role: 'Delivery Merchandise' },
    { name: 'Blue Dart', role: 'Express Courier' },
    { name: 'PhonePe', role: 'Corporate Gifting' },
    { name: 'Samsung', role: 'Consumer Electronics' },
    { name: 'Suzuki', role: 'Automotive Accessories' },
    { name: 'Wipro', role: 'Office Essentials' },
    { name: 'Airtel', role: 'Customer Uniforms' },
    { name: 'Mahindra', role: 'Industrial Supplies' },
    { name: 'Flipkart', role: 'Retail Partner' },
    { name: 'Zomato', role: 'Merchant Gear' },
    { name: 'Reliance', role: 'Retail Distribution' }
  ];

  // Marketplace Products Catalog
  const marketplaceProducts = [
    {
      id: 1,
      title: 'Men’s Ultra-Soft Bio-Washed Cotton Crew Neck T-Shirt',
      category: 'apparel',
      categoryLabel: 'Fashion',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
      price: 399,
      mrp: 899,
      discount: '56% off',
      rating: 4.8,
      reviews: 1420,
      delivery: 'FREE Delivery Tomorrow',
      badge: 'Bestseller'
    },
    {
      id: 2,
      title: 'Premium Corporate Piqué Knit Polo T-Shirt (Embroidered)',
      category: 'uniforms',
      categoryLabel: 'Corporate Wear',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80',
      price: 499,
      mrp: 999,
      discount: '50% off',
      rating: 4.7,
      reviews: 980,
      delivery: 'FREE Delivery in 2 Days',
      badge: 'Top Rated'
    },
    {
      id: 3,
      title: 'Heavyweight Unisex Pullover Fleece Hoodie (Winter Edition)',
      category: 'apparel',
      categoryLabel: 'Winterwear',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
      price: 899,
      mrp: 1899,
      discount: '53% off',
      rating: 4.9,
      reviews: 2150,
      delivery: 'FREE Delivery Tomorrow',
      badge: 'Hot Deal'
    },
    {
      id: 4,
      title: 'Anti-Theft Waterproof Laptop Backpack with USB Port',
      category: 'bags',
      categoryLabel: 'Bags & Luggage',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
      price: 1199,
      mrp: 2499,
      discount: '52% off',
      rating: 4.8,
      reviews: 3410,
      delivery: 'FREE Delivery in 2 Days',
      badge: 'Trending'
    },
    {
      id: 5,
      title: 'Double-Wall Vacuum Insulated Stainless Steel Thermal Flask 1L',
      category: 'drinkware',
      categoryLabel: 'Drinkware',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
      price: 549,
      mrp: 1299,
      discount: '58% off',
      rating: 4.7,
      reviews: 890,
      delivery: 'FREE Delivery Tomorrow',
      badge: 'Bestseller'
    },
    {
      id: 6,
      title: 'Eco-Friendly Heavy Duty Canvas Tote Bag with Zipper',
      category: 'bags',
      categoryLabel: 'Bags & Totes',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
      price: 249,
      mrp: 599,
      discount: '58% off',
      rating: 4.6,
      reviews: 640,
      delivery: 'FREE Delivery in 3 Days',
      badge: 'Eco Friendly'
    },
    {
      id: 7,
      title: 'All-Weather Industrial Steel-Toe Safety Work Boots',
      category: 'footwear',
      categoryLabel: 'Footwear & Safety',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
      price: 1299,
      mrp: 2799,
      discount: '54% off',
      rating: 4.8,
      reviews: 1820,
      delivery: 'FREE Delivery Tomorrow',
      badge: 'ISI Certified'
    },
    {
      id: 8,
      title: 'Executive Matte Black Metal Rollerball Pen & Case Gift Set',
      category: 'stationery',
      categoryLabel: 'Stationery & Gifts',
      image: 'https://images.unsplash.com/photo-1585336261026-6b2f15f013d9?auto=format&fit=crop&w=700&q=80',
      price: 299,
      mrp: 699,
      discount: '57% off',
      rating: 4.9,
      reviews: 1120,
      delivery: 'FREE Delivery in 2 Days',
      badge: 'Premium Gift'
    },
    {
      id: 9,
      title: 'Premium Hardcover PU Leather Journal & Planner 2026',
      category: 'stationery',
      categoryLabel: 'Office Stationery',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      price: 349,
      mrp: 799,
      discount: '56% off',
      rating: 4.8,
      reviews: 840,
      delivery: 'FREE Delivery Tomorrow',
      badge: 'Top Rated'
    },
    {
      id: 10,
      title: 'Hospitality & Culinary Master Chef Apron with Utility Pockets',
      category: 'uniforms',
      categoryLabel: 'Kitchen Wear',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=80',
      price: 449,
      mrp: 899,
      discount: '50% off',
      rating: 4.7,
      reviews: 730,
      delivery: 'FREE Delivery in 2 Days',
      badge: 'Stain Proof'
    },
    {
      id: 11,
      title: 'High-Visibility Breathable Reflective Safety Vest with Pockets',
      category: 'footwear',
      categoryLabel: 'Safety Gear',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
      price: 199,
      mrp: 499,
      discount: '60% off',
      rating: 4.6,
      reviews: 540,
      delivery: 'FREE Delivery Tomorrow',
      badge: 'High-Vis'
    },
    {
      id: 12,
      title: 'Minimalist Ceramic Coffee Mug & Coaster Set (Matte Finish)',
      category: 'drinkware',
      categoryLabel: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
      price: 299,
      mrp: 649,
      discount: '54% off',
      rating: 4.8,
      reviews: 910,
      delivery: 'FREE Delivery in 2 Days',
      badge: 'Handcrafted'
    }
  ];

  // Filter products by category and search
  const filteredProducts = marketplaceProducts.filter((prod) => {
    const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch = prod.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Manufacturing Hubs Data
  const manufacturingHubs = [
    { city: 'Tirupur, TN', category: 'apparel', label: 'Cotton Fashion & T-Shirts', sellers: '4,200+ Verified Sellers', icon: '👕' },
    { city: 'Surat, Gujarat', category: 'apparel', label: 'Ethnic & Modern Fabrics', sellers: '8,500+ Top Sellers', icon: '🧵' },
    { city: 'Moradabad, UP', category: 'drinkware', label: 'Metalware & Drinkware', sellers: '2,100+ Manufacturers', icon: '🏺' },
    { city: 'Agra, UP', category: 'footwear', label: 'Footwear & Safety Gear', sellers: '3,100+ Shoemakers', icon: '👞' },
    { city: 'Ludhiana, Punjab', category: 'uniforms', label: 'Winter Knitwear & Uniforms', sellers: '2,800+ Mills', icon: '🧥' },
    { city: 'Noida / NCR', category: 'stationery', label: 'Stationery & Corporate Gifts', sellers: '3,400+ Brands', icon: '📦' }
  ];

  // Frequently Asked Questions (FAQ) for the Marketplace
  const faqs = [
    {
      q: 'How do I place an order on RealBell BizMart?',
      a: 'Browsing and ordering on RealBell BizMart is seamless! Select any marketplace product, choose your quantity, and click "Order Now" or "Add to Cart". Enter your shipping address and pay securely using Razorpay (UPI, Cards, Net Banking).'
    },
    {
      q: 'What payment methods are supported on RealBell BizMart?',
      a: 'We support all major payment modes via Razorpay including Google Pay, PhonePe, Paytm, BHIM UPI, Visa/Mastercard/RuPay credit & debit cards, and Net Banking across 50+ Indian banks. All transactions are protected with 256-bit SSL encryption.'
    },
    {
      q: 'How can I track my order delivery in real time?',
      a: 'Once your order is confirmed, you can track its delivery status directly from your "Track Order" page in your Buyer Dashboard. We provide real-time status steps: Order Placed → Confirmed & Paid → Processing → Dispatched → Out for Delivery → Delivered.'
    },
    {
      q: 'Can I register as a seller / shopkeeper to list products?',
      a: 'Yes! Anyone with a verified shop or business can register as a seller. Click "Become a Seller" in the navigation bar, sign up with a seller account, submit your business documents (GSTIN and shop address) for admin approval, and start listing your products to millions of buyers.'
    },
    {
      q: 'How are sellers and products verified on RealBell BizMart?',
      a: 'Every seller account undergoes mandatory business verification by our Admin team before product listings are approved. We check valid GSTIN registration, business credentials, and genuine catalog items to ensure 100% authentic products.'
    },
    {
      q: 'What if I receive a damaged or incorrect product?',
      a: 'RealBell BizMart offers complete Buyer Protection. If you receive a damaged or incorrect shipment, you can request an instant return or refund via your order dashboard or reach our 24/7 customer support team for immediate resolution.'
    }
  ];

  return (
    <div className="min-h-screen bg-theme-page font-poppins text-theme-main antialiased selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden transition-colors duration-200">
      
      {/* 1. Header / Navbar with Dark Mode Toggle */}
      <Navbar 
        selectedCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          const el = document.getElementById('product-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Hero Section - Modern Marketplace Aesthetic */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Ambient Gradient Lighting */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-all duration-700"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-amber-950/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Trust Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>India's Premier Online Marketplace Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="text-white text-[11px]">100% Verified Sellers</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={fadeInUp} className="text-3xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Shop Direct from Verified <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Shopkeepers & Brands
                </span> Across India
              </motion.h1>

              {/* Sub-headline */}
              <motion.p variants={fadeInUp} className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Discover trending apparel, uniforms, tech gadgets, bags, drinkware, and gifts with unbeatable marketplace pricing, Razorpay payment escrow, and doorstep express delivery.
              </motion.p>

              {/* Primary Call To Actions */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const el = document.getElementById('product-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold px-7 sm:px-8 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  <span>Explore Marketplace Deals</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/signup?role=seller')}
                  className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-white font-semibold px-6 sm:px-7 py-3.5 rounded-xl border border-slate-700/80 hover:border-amber-400/60 transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Become a Seller</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </motion.button>
              </motion.div>

              {/* Mini Feature Tickers */}
              <motion.div variants={fadeInUp} className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Razorpay Protection</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <RotateCcw className="w-4 h-4 text-blue-400" />
                  <span>7-Day Easy Returns</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual Stats Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4"
            >
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-amber-500/50 transition">
                <div className="text-amber-400 font-bold text-2xl sm:text-3xl">50,000+</div>
                <p className="text-xs text-slate-300 font-semibold mt-1">Verified Products</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Fashion, Tech, Living & Office</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-amber-500/50 transition">
                <div className="text-emerald-400 font-bold text-2xl sm:text-3xl">10,000+</div>
                <p className="text-xs text-slate-300 font-semibold mt-1">Active Shopkeepers</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pan-India Verified Merchants</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-amber-500/50 transition">
                <div className="text-blue-400 font-bold text-2xl sm:text-3xl">₹0</div>
                <p className="text-xs text-slate-300 font-semibold mt-1">Free Delivery</p>
                <p className="text-[10px] text-slate-400 mt-0.5">On all marketplace orders</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-amber-500/50 transition">
                <div className="text-purple-400 font-bold text-2xl sm:text-3xl">24/7</div>
                <p className="text-xs text-slate-300 font-semibold mt-1">Buyer Support</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Toll-Free & Live WhatsApp</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Value Props Strip */}
      <section className="bg-theme-card border-b border-theme-border py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">Pan-India Express Delivery</h4>
                <p className="text-[11px] text-theme-muted">Fast doorstep shipping</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">Razorpay Secure Escrow</h4>
                <p className="text-[11px] text-theme-muted">100% payment safety</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">7-Day Easy Returns</h4>
                <p className="text-[11px] text-theme-muted">Hassle-free replacement</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">24/7 Customer Care</h4>
                <p className="text-[11px] text-theme-muted">Dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Enterprise Brands Trust Bar */}
      <section className="py-10 bg-theme-page border-b border-theme-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-theme-muted font-semibold">
              Trusted by 10,000+ Leading Indian Brands & Merchants
            </span>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3"
          >
            {(showAllBrands ? clientBrands : clientBrands.slice(0, 8)).map((brand, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -3, scale: 1.03 }}
                className="bg-theme-card p-3 rounded-xl border border-theme-border text-center shadow-2xs hover:border-amber-400 transition"
              >
                <span className="text-xs sm:text-sm font-bold text-theme-main truncate block">
                  {brand.name}
                </span>
                <span className="text-[10px] text-theme-muted flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{brand.role}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-5">
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{showAllBrands ? 'Show Less' : 'View More Brands'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllBrands ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Direct Sourcing Hubs */}
      <section className="py-12 sm:py-16 bg-theme-card border-b border-theme-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Direct Merchant Hubs
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-theme-main mt-1">
                Explore Products by Regional Manufacturing Centers
              </h2>
            </div>
            <p className="text-xs text-theme-muted max-w-md">
              Tap directly into India's most celebrated industrial clusters and artisan hubs. Click any region to filter products.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {manufacturingHubs.map((hub, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveCategory(hub.category);
                  const el = document.getElementById('product-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`bg-theme-page rounded-2xl p-4 border transition cursor-pointer text-center group ${
                  activeCategory === hub.category ? 'border-amber-500 shadow-md' : 'border-theme-border hover:border-amber-400'
                }`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{hub.icon}</div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">{hub.city}</h4>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 truncate">{hub.label}</p>
                <span className="inline-block mt-2 text-[10px] bg-theme-card-subtle text-theme-muted font-medium px-2 py-0.5 rounded-full">
                  {hub.sellers}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Marketplace Product Catalog */}
      <section id="product-catalog" className="py-14 sm:py-20 bg-theme-page transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/50">
              Trending Marketplace Catalog
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-theme-main mt-2">
              Featured Products & Top Deals
            </h2>
            <p className="text-theme-muted text-xs sm:text-sm mt-2">
              Quality verified products delivered directly from Indian sellers with 100% payment escrow.
            </p>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-theme-card p-4 rounded-3xl border border-theme-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by keyword..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 text-xs">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'apparel', label: 'Fashion & Apparel' },
                { id: 'uniforms', label: 'Workwear & Uniforms' },
                { id: 'bags', label: 'Bags & Luggage' },
                { id: 'drinkware', label: 'Drinkware & Living' },
                { id: 'footwear', label: 'Footwear & Safety' },
                { id: 'stationery', label: 'Gifts & Stationery' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-theme-card-subtle text-theme-muted hover:bg-theme-card border border-theme-border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {catalogLoading ? (
              <ProductCardSkeleton count={8} viewMode="grid" />
            ) : (
              filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  whileHover={{ y: -6 }}
                  className="bg-theme-card rounded-3xl border border-theme-border hover:border-amber-400 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Badge */}
                    <div className="relative aspect-4/3 bg-theme-page overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {prod.badge && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                          {prod.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {prod.discount}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                        {prod.categoryLabel}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-theme-main line-clamp-2 leading-snug" title={prod.title}>
                        {prod.title}
                      </h3>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400" />
                          <span>{prod.rating}</span>
                        </span>
                        <span className="text-[11px] text-theme-muted">({prod.reviews} ratings)</span>
                      </div>

                      {/* Price Block */}
                      <div className="pt-1 flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-theme-main">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-theme-muted line-through">
                          ₹{prod.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {prod.delivery}
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Buttons: Add To Cart & Buy Now */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleAddToCart(prod)}
                      className="w-full bg-theme-card-subtle hover:bg-theme-card text-theme-main font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-theme-border"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Cart</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleBuyNow(prod)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Order Now with Razorpay"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-theme-card rounded-3xl border border-dashed border-theme-border p-8">
              <PackageCheck className="w-12 h-12 text-theme-muted mx-auto mb-3" />
              <h4 className="font-bold text-theme-main">No products match your search</h4>
              <p className="text-xs text-theme-muted mt-1">Try clearing keywords or switching categories.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
                className="mt-4 bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 7. Why Choose RealBell BizMart (Trust & Value Props) */}
      <section id="why-choose" className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              The RealBell Guarantee
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3">
              Why Customers Love Shopping on RealBell BizMart
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              We connect you directly to authentic manufacturers & shopkeepers with bank-grade payment security.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-amber-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Direct Merchant Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save significantly compared to high-margin retail stores by shopping directly from verified Indian shopkeepers.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-emerald-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">100% Genuine & Verified</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every merchant's GSTIN and business credentials are verified by our Admin team before product listings are published.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-blue-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Razorpay Escrow Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay safely with UPI, debit/credit cards, and net banking. Funds are securely managed until delivery.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-purple-400/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Hassle-Free Returns</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Not satisfied with your item? Enjoy easy 7-day replacements and friendly support on all eligible products.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Frequently Asked Questions (FAQ) - Interactive Accordion */}
      <section id="faq" className="py-14 sm:py-20 bg-theme-card border-b border-theme-border transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/50">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-theme-main">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted max-w-xl mx-auto">
              Everything you need to know about shopping, payment security, order tracking, and selling on RealBell BizMart.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-theme-border rounded-2xl overflow-hidden transition shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left px-5 py-4 bg-theme-page hover:bg-theme-card-subtle font-bold text-xs sm:text-sm text-theme-main flex justify-between items-center transition cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-theme-muted shrink-0 transition-transform duration-200 ${
                      activeFaq === index ? 'rotate-90 text-amber-600 dark:text-amber-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 py-4 text-xs sm:text-sm text-theme-muted bg-theme-card leading-relaxed border-t border-theme-border font-normal overflow-hidden"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-theme-page border border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-bold text-sm text-theme-main">Still have questions?</h4>
              <p className="text-xs text-theme-muted">Our customer support team is available 24/7 to help.</p>
            </div>
            <a
              href="tel:18008907325"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1800-890-REAL (7325)</span>
            </a>
          </div>

        </div>
      </section>

      {/* 9. Seller Invitation & Marketplace CTA Banner */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-block bg-amber-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-full">
            Start Selling on RealBell BizMart
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight">
            Are You a Shopkeeper, Brand, or Merchant? <br className="hidden sm:block" />
            Grow Your Business Across India Today
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            List your products, access hundreds of thousands of active buyers, and receive guaranteed payouts with complete seller protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup?role=seller"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Register as a Seller Free</span>
            </Link>

            <button
              onClick={() => {
                const el = document.getElementById('product-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition text-xs sm:text-sm cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        </div>
      </section>

      {/* 10. Floating Customer Support Assistant */}
      <SourcingAssistant />

      {/* 11. Slide-Out Shopping Cart Drawer */}
      <CartModal />

      {/* 12. Footer */}
      <Footer />

    </div>
  );
};

export default Home;