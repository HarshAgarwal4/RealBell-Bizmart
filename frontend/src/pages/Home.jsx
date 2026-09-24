import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RFQModal from '../components/RFQModal';
import SourcingAssistant from '../components/SourcingAssistant';
import { CartModal } from '../user/CartModal';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
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
  ShoppingCart
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

  // State for RFQ Modal
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedProductForRFQ, setSelectedProductForRFQ] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Direct Wholesale Purchase / Add To Cart Handler
  const handleAddToCart = (prod) => {
    if (!user) {
      toast.info("Please sign in to order wholesale products with Razorpay");
      navigate('/login');
      return;
    }
    const priceNum = parseInt(prod.estPrice.replace(/[^0-9]/g, '')) || 250;
    const moqNum = parseInt(prod.moq.replace(/[^0-9]/g, '')) || 10;
    addToCart({
      _id: String(prod.id),
      title: prod.title,
      price: priceNum,
      moq: moqNum,
      quantity: moqNum,
      image: prod.image,
      unit: prod.moq.includes('set') ? 'set' : 'pc'
    });
    setIsCartOpen(true);
    toast.success(`Added ${prod.title} to Wholesale Cart!`);
  };

  // Quick RFQ Bar State
  const [quickProduct, setQuickProduct] = useState('');
  const [quickQty, setQuickQty] = useState('500');
  const [quickCat, setQuickCat] = useState('Apparel & Garments');

  const handleOpenRFQ = (productInfo = null) => {
    setSelectedProductForRFQ(productInfo || { title: 'Direct Wholesale Quotation' });
    setRfqModalOpen(true);
  };

  const handleQuickRFQSubmit = (e) => {
    e.preventDefault();
    if (!quickProduct) {
      handleOpenRFQ({ title: 'Bulk Order Requirement', category: quickCat, moq: quickQty });
    } else {
      handleOpenRFQ({ title: quickProduct, category: quickCat, moq: quickQty });
    }
  };

  // Enterprise client brands matching the screenshot
  const clientBrands = [
    { name: 'Amazon', role: 'Corporate Procurement' },
    { name: 'Swiggy', role: 'Fleet Uniforms' },
    { name: 'Aprilia', role: 'Official Merchandise' },
    { name: 'Tata', role: 'Safety Workwear' },
    { name: 'Delhivery', role: 'Custom Packaging' },
    { name: 'Zepto', role: 'Delivery Gear & Bags' },
    { name: 'Blue Dart', role: 'Courier Uniforms' },
    { name: 'PhonePe', role: 'Welcome Kits' },
    { name: 'Samsung', role: 'Retail Merchandise' },
    { name: 'Suzuki', role: 'Plant Workwear' },
    { name: 'Wipro', role: 'Corporate Gifting' },
    { name: 'Airtel', role: 'Staff Uniforms' },
    { name: 'Mahindra', role: 'Automotive Apparel' },
    { name: 'Flipkart', role: 'Logistics Packaging' },
    { name: 'Zomato', role: 'Rider Merchandise' },
    { name: 'Reliance', role: 'Retail & Uniforms' }
  ];

  // Comprehensive Product Catalog matching the screenshot
  const productCatalog = [
    {
      id: 1,
      title: 'T-Shirts (Round Neck & Polo)',
      category: 'apparel',
      categoryLabel: 'Apparel',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹149 - ₹240 / pc',
      leadTime: '7-10 Days',
      badge: 'Bestseller'
    },
    {
      id: 2,
      title: 'Hoodies & Sweatshirts',
      category: 'apparel',
      categoryLabel: 'Apparel',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
      moq: '50 pcs',
      estPrice: '₹390 - ₹590 / pc',
      leadTime: '10-12 Days',
      badge: 'Fleece 320 GSM'
    },
    {
      id: 3,
      title: 'Backpacks & Travel Bags',
      category: 'bags',
      categoryLabel: 'Bags & Luggage',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
      moq: '50 pcs',
      estPrice: '₹340 - ₹620 / pc',
      leadTime: '12-15 Days',
      badge: 'Water Resistant'
    },
    {
      id: 4,
      title: 'School Backpacks & Kit Bags',
      category: 'bags',
      categoryLabel: 'Bags & Luggage',
      image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹220 - ₹380 / pc',
      leadTime: '10-14 Days',
      badge: 'Heavy Duty'
    },
    {
      id: 5,
      title: 'Corporate Formal Shirts',
      category: 'uniforms',
      categoryLabel: 'Uniforms',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
      moq: '50 pcs',
      estPrice: '₹340 - ₹520 / pc',
      leadTime: '8-10 Days',
      badge: 'Custom Embroidered'
    },
    {
      id: 6,
      title: 'Eco-Friendly Canvas & Jute Totes',
      category: 'bags',
      categoryLabel: 'Bags & Packaging',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
      moq: '200 pcs',
      estPrice: '₹45 - ₹95 / pc',
      leadTime: '5-7 Days',
      badge: '100% Organic'
    },
    {
      id: 7,
      title: 'School Uniform Sets (Boys & Girls)',
      category: 'uniforms',
      categoryLabel: 'Uniforms',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80',
      moq: '100 sets',
      estPrice: '₹380 - ₹650 / set',
      leadTime: '14-20 Days',
      badge: 'Bulk Supply'
    },
    {
      id: 8,
      title: 'Industrial Safety & Workplace Workwear',
      category: 'footwear',
      categoryLabel: 'Industrial',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
      moq: '50 sets',
      estPrice: '₹420 - ₹780 / set',
      leadTime: '10-15 Days',
      badge: 'High-Vis & FR'
    },
    {
      id: 9,
      title: 'Security & Facility Staff Uniforms',
      category: 'uniforms',
      categoryLabel: 'Uniforms',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=700&q=80',
      moq: '50 sets',
      estPrice: '₹490 - ₹750 / set',
      leadTime: '10-14 Days',
      badge: 'Durable Fabric'
    },
    {
      id: 10,
      title: 'Hospital Scrubs & Doctor Lab Coats',
      category: 'uniforms',
      categoryLabel: 'Uniforms & Medical',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹260 - ₹440 / pc',
      leadTime: '7-10 Days',
      badge: 'Antimicrobial'
    },
    {
      id: 11,
      title: 'Custom Promotional Caps & Hats',
      category: 'apparel',
      categoryLabel: 'Merchandise',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹65 - ₹120 / pc',
      leadTime: '7-9 Days',
      badge: '3D Embroidery'
    },
    {
      id: 12,
      title: 'Hospitality & Hotel Chef Uniforms',
      category: 'uniforms',
      categoryLabel: 'Uniforms',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=80',
      moq: '50 sets',
      estPrice: '₹450 - ₹820 / set',
      leadTime: '10-14 Days',
      badge: 'Stain Resistant'
    },
    {
      id: 13,
      title: 'Premium Metal Executive Pens',
      category: 'stationery',
      categoryLabel: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1585336261026-6b2f15f013d9?auto=format&fit=crop&w=700&q=80',
      moq: '200 pcs',
      estPrice: '₹35 - ₹110 / pc',
      leadTime: '5-7 Days',
      badge: 'Laser Engraved'
    },
    {
      id: 14,
      title: 'Hardcover Diaries & Corporate Planners',
      category: 'stationery',
      categoryLabel: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹95 - ₹240 / pc',
      leadTime: '7-10 Days',
      badge: 'Gold Foiled'
    },
    {
      id: 15,
      title: 'Stainless Steel Insulated Flasks & Bottles',
      category: 'drinkware',
      categoryLabel: 'Drinkware',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹165 - ₹320 / pc',
      leadTime: '7-12 Days',
      badge: '24h Hot & Cold'
    },
    {
      id: 16,
      title: 'Cotton Loungewear & Nightwear Sets',
      category: 'apparel',
      categoryLabel: 'Apparel',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
      moq: '100 sets',
      estPrice: '₹280 - ₹460 / set',
      leadTime: '12-16 Days',
      badge: '100% Combed Cotton'
    },
    {
      id: 17,
      title: 'Ceramic Mugs & Travel Coffee Tumblers',
      category: 'drinkware',
      categoryLabel: 'Drinkware',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
      moq: '150 pcs',
      estPrice: '₹55 - ₹130 / pc',
      leadTime: '6-8 Days',
      badge: 'Microwave Safe'
    },
    {
      id: 18,
      title: 'Steel-Toe Safety Shoes & Footwear',
      category: 'footwear',
      categoryLabel: 'Footwear & Safety',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
      moq: '50 pairs',
      estPrice: '₹450 - ₹890 / pair',
      leadTime: '10-15 Days',
      badge: 'ISI Certified'
    },
    {
      id: 19,
      title: 'Winter Puffer Jackets & Windbreakers',
      category: 'apparel',
      categoryLabel: 'Apparel',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80',
      moq: '50 pcs',
      estPrice: '₹590 - ₹1,150 / pc',
      leadTime: '12-16 Days',
      badge: 'Thermal Down'
    },
    {
      id: 20,
      title: 'Executive Welcome Kits & Gift Hampers',
      category: 'stationery',
      categoryLabel: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80',
      moq: '25 boxes',
      estPrice: '₹750 - ₹1,850 / box',
      leadTime: '7-10 Days',
      badge: 'Custom Branded'
    },
    {
      id: 21,
      title: 'Hotel Bed Linen, Comforters & Duvets',
      category: 'home',
      categoryLabel: 'Home & Hospitality',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80',
      moq: '50 sets',
      estPrice: '₹550 - ₹1,200 / set',
      leadTime: '14-18 Days',
      badge: '300-600 TC Sateen'
    },
    {
      id: 22,
      title: 'Traditional Ethnic Kurtas & Silk Sarees',
      category: 'apparel',
      categoryLabel: 'Apparel & Ethnic',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      moq: '30 pcs',
      estPrice: '₹420 - ₹1,400 / pc',
      leadTime: '10-15 Days',
      badge: 'Handcrafted'
    },
    {
      id: 23,
      title: 'Waterproof Heavy Duty Rainwear',
      category: 'apparel',
      categoryLabel: 'Industrial & Seasonal',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
      moq: '100 pcs',
      estPrice: '₹180 - ₹340 / pc',
      leadTime: '8-12 Days',
      badge: 'Double Layer'
    },
    {
      id: 24,
      title: 'Cotton Bath & Face Towels',
      category: 'home',
      categoryLabel: 'Home & Hotel',
      image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=700&q=80',
      moq: '200 pcs',
      estPrice: '₹75 - ₹190 / pc',
      leadTime: '7-10 Days',
      badge: '500 GSM Plush'
    }
  ];

  // Filtering products
  const filteredProducts = productCatalog.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Manufacturing Hubs Data
  const manufacturingHubs = [
    { city: 'Tirupur, TN', category: 'Knitwear & T-Shirts', suppliers: '4,200+ Suppliers', icon: '👕' },
    { city: 'Surat, Gujarat', category: 'Textiles & Synthetic Fabrics', suppliers: '8,500+ Weavers', icon: '🧵' },
    { city: 'Moradabad, UP', category: 'Brass & Metal Drinkware', suppliers: '2,100+ Foundries', icon: '🏺' },
    { city: 'Agra, UP', category: 'Leather & Safety Footwear', suppliers: '3,100+ Manufacturers', icon: '👞' },
    { city: 'Ludhiana, Punjab', category: 'Woolen Garments & Activewear', suppliers: '2,800+ Mills', icon: '🧥' },
    { city: 'Noida / NCR', category: 'Packaging & Custom Gifts', suppliers: '3,400+ Units', icon: '📦' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-poppins text-slate-800 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden transition-colors duration-200">
      
      {/* 1. Header / Navbar with Dark Mode Toggle */}
      <Navbar 
        onOpenRFQ={handleOpenRFQ} 
        selectedCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          const el = document.getElementById('product-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Hero Section - Matching the modern marketplace aesthetic */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Modern Marketplace Background with dramatic lighting overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        
        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Content with Motion */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-7 space-y-5 sm:space-y-6"
            >
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>RealBell BizMart • India's B2B Sourcing Hub</span>
              </div>

              {/* Headline from Screenshot */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                The marketplace <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                  to the world
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-normal">
                Connect directly with 50,000+ verified Indian wholesale suppliers, distributors, and brands. Direct marketplace pricing, custom bulk orders, assured quality inspections, and seamless door-to-door delivery.
              </p>

              {/* Stats Bar */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-800/80">
                <div className="bg-slate-900/40 p-2 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400">50,000+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-normal">Verified Sellers</div>
                </div>
                <div className="bg-slate-900/40 p-2 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">1M+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-normal">Products Listed</div>
                </div>
                <div className="bg-slate-900/40 p-2 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400">₹500 Cr+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-normal">Trade Handled</div>
                </div>
                <div className="bg-slate-900/40 p-2 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">150+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-normal">Export Markets</div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="pt-2 sm:pt-4 flex flex-wrap gap-3 sm:gap-4 items-center">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOpenRFQ({ title: 'Direct Wholesale Quotation' })}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-[length:200%_auto] hover:bg-right text-slate-950 font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Post Buying RFQ (Free)</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  href="#product-catalog"
                  className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-white font-medium px-6 py-3 sm:py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Browse Products</span>
                </motion.a>
              </div>

            </motion.div>

            {/* Right Hero: 3 Distinct Feature Cards (Authentic to the screenshot) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="lg:col-span-5 space-y-3 sm:space-y-4"
            >
              
              {/* Card 1: Orange/Red Card - Post Buying Requirement */}
              <motion.div 
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenRFQ({ title: 'Bulk Buyer RFQ' })}
                className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-2xl p-4 sm:p-5 shadow-xl border border-orange-400/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition duration-300">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                        Post Buying Requirement
                      </h3>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1.5 transition" />
                    </div>
                    <p className="text-orange-100 text-xs mt-1 leading-relaxed line-clamp-2 font-normal">
                      Get custom quotations directly from verified wholesale suppliers within 24 hours at marketplace wholesale prices.
                    </p>
                    <span className="inline-block mt-2 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-200">
                      Submit RFQ in 60s →
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Royal Blue Card - Bulk Wholesale & Private Label */}
              <motion.div 
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenRFQ({ title: 'Bulk Wholesale & Private Label' })}
                className="group relative bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-2xl p-4 sm:p-5 shadow-xl border border-blue-400/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition duration-300">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                        Bulk Wholesale & Private Label
                      </h3>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1.5 transition" />
                    </div>
                    <p className="text-blue-100 text-xs mt-1 leading-relaxed line-clamp-2 font-normal">
                      Source wholesale uniforms, apparel, corporate gifts, bottles, packaging & private label lines.
                    </p>
                    <span className="inline-block mt-2 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-blue-200">
                      Start Bulk Order →
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Emerald Green Card - Verified Seller Network */}
              <motion.div 
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById('why-choose');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 rounded-2xl p-4 sm:p-5 shadow-xl border border-emerald-400/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition duration-300">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                        Verified Seller Network
                      </h3>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1.5 transition" />
                    </div>
                    <p className="text-emerald-100 text-xs mt-1 leading-relaxed line-clamp-2 font-normal">
                      100% verified seller profiles, authentic business compliance, and Escrow payment guarantee.
                    </p>
                    <span className="inline-block mt-2 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-emerald-200">
                      Learn About Assurance →
                    </span>
                  </div>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Fast RFQ Quick-Order Bar */}
      <section className="bg-amber-500 dark:bg-amber-600 py-3.5 sm:py-4 px-3 sm:px-6 shadow-md relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleQuickRFQSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-950 font-semibold text-xs sm:text-sm lg:text-base shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
              <span>Instant Wholesale RFQ Builder:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full flex-1">
              <input
                type="text"
                value={quickProduct}
                onChange={(e) => setQuickProduct(e.target.value)}
                placeholder="What product do you need? (e.g. 500 T-Shirts)"
                className="bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden border border-amber-600 dark:border-amber-700"
              />

              <select
                value={quickCat}
                onChange={(e) => setQuickCat(e.target.value)}
                className="bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden border border-amber-600 dark:border-amber-700"
              >
                <option value="Apparel & Garments">Apparel & Garments</option>
                <option value="Corporate Uniforms">Corporate Uniforms</option>
                <option value="Bags & Luggage">Bags & Luggage</option>
                <option value="Corporate Gifting & Stationery">Corporate Gifting & Stationery</option>
                <option value="Drinkware & Bottles">Drinkware & Bottles</option>
                <option value="Industrial Safety">Industrial Safety</option>
                <option value="Packaging">Packaging</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={quickQty}
                  onChange={(e) => setQuickQty(e.target.value)}
                  placeholder="Qty (pcs)"
                  className="w-1/2 bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden border border-amber-600 dark:border-amber-700"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-1/2 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl py-2 px-3 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Get Quotes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 4. Trusted by Leading Brands & Global Enterprises (Matching the uploaded screenshot) */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400 bg-orange-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-amber-800/50">
              Enterprise Procurement Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2.5">
              Powering Procurement for 500+ Global Enterprises & Leading Brands
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-normal">
              From Fortune 500 corporations to hyper-growth businesses, procurement teams rely on RealBell BizMart for contract manufacturing and wholesale supplies.
            </p>
          </motion.div>

          {/* Grid of Brand Logos */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            {(showAllBrands ? clientBrands : clientBrands.slice(0, 12)).map((brand, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="group h-20 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 rounded-xl p-3 flex flex-col items-center justify-center transition shadow-2xs hover:shadow-lg cursor-default"
              >
                <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm sm:text-base tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal flex items-center gap-1 mt-0.5 truncate max-w-full">
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{brand.role}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-amber-400 hover:text-orange-700 bg-orange-50 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl transition cursor-pointer border border-orange-200 dark:border-slate-700"
            >
              <span>{showAllBrands ? 'Show Less' : 'View More Brands'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllBrands ? 'rotate-90' : ''}`} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 5. Major Manufacturing Clusters in India */}
      <section className="py-12 sm:py-16 bg-slate-100/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
          >
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Direct Sourcing Hubs
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                India's Key Manufacturing Clusters on RealBell
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Tap directly into region-specific industrial hubs specializing in heritage textile weaving, heavy knitwear, metalware, and high-spec leather craft.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            {manufacturingHubs.map((hub, idx) => (
              <motion.div 
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpenRFQ({ title: `${hub.category} Bulk Sourcing`, category: hub.category })}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{hub.icon}</div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">{hub.city}</h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1 truncate">{hub.category}</p>
                <span className="inline-block mt-2 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-950/60 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition">
                  {hub.suppliers}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Master Product & Category Grid (Directly mirroring the uploaded design) */}
      <section id="product-catalog" className="py-14 sm:py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-amber-400 bg-orange-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-amber-800/50">
              Verified Wholesale Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Explore Wholesale Marketplace Products
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-normal">
              All items available in bulk wholesale lots with competitive volume pricing.
            </p>
          </motion.div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8 bg-slate-50 dark:bg-slate-850 p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            
            {/* Category Filter Pills with horizontal scroll on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'apparel', label: 'Apparel & Wear' },
                { id: 'uniforms', label: 'Uniforms' },
                { id: 'bags', label: 'Bags & Luggage' },
                { id: 'stationery', label: 'Gifts & Stationery' },
                { id: 'drinkware', label: 'Drinkware' },
                { id: 'footwear', label: 'Footwear & Safety' },
                { id: 'home', label: 'Home Textiles' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* In-Catalog Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-normal"
              />
            </div>
          </div>

          {/* Grid of Product Cards with SCROLLING ANIMATION for every card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.22, 1, 0.36, 1], 
                  delay: (idx % 4) * 0.08 
                }}
                whileHover={{ y: -7 }}
                className="group bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/70 overflow-hidden shadow-2xs hover:shadow-2xl dark:hover:shadow-amber-500/5 transition-all duration-300 flex flex-col"
              >
                {/* Title on Top (Matching the exact styling in the screenshot) */}
                <div className="p-3 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate" title={prod.title}>
                    {prod.title}
                  </h3>
                </div>

                {/* Product Image Container */}
                <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-850 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {prod.badge}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                    MOQ: {prod.moq}
                  </span>
                </div>

                {/* Price & Lead Time Meta */}
                <div className="p-3 bg-white dark:bg-slate-950 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Est. Wholesale Price</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{prod.estPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Lead Time</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{prod.leadTime}</span>
                  </div>
                </div>

                {/* Product Action Buttons: Buy Now & Request Quote */}
                <div className="p-3 bg-white dark:bg-slate-950 mt-auto grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAddToCart(prod)}
                    className="w-full bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Order with Razorpay"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Order Now</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleOpenRFQ(prod)}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    title="Custom RFQ Quotation"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Post RFQ</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <PackageCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 dark:text-white">No products match your filter</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">Try clearing search keywords or selecting All Categories.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
                className="mt-4 bg-amber-500 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenRFQ({ title: 'Full Product Catalog Inquiry' })}
              className="w-full sm:w-auto bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white font-medium text-xs sm:text-sm px-8 py-3.5 rounded-xl border border-slate-800 dark:border-slate-700 shadow-md transition inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Can't find your product? Request Custom Sourcing</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </motion.button>
          </div>

        </div>
      </section>

      {/* 7. Why Choose RealBell BizMart (Trust & Value Props) */}
      <section id="why-choose" className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              The RealBell Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3">
              Why Global Businesses Source on RealBell BizMart
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              We eliminate intermediaries, mitigate procurement fraud, and guarantee contract terms from order placement to final delivery.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {/* Value 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Direct Wholesale Pricing</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Save 25% to 40% compared to local retail middlemen and brokers. You transact directly with verified wholesale distributor rates.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Verified Seller Audits</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Every listed seller undergoes business compliance verification. We audit GST credentials, catalog authenticity, and seller track records.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Trade Assurance & Escrow</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Payments are securely placed in RealBell Escrow. Funds are only transferred after third-party quality inspection passes pre-shipment tests.
              </p>
            </motion.div>

            {/* Value 4 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Doorstep Logistics</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Full logistics orchestration across India and 150+ countries. RealBell manages domestic freight, customs documentation, and container shipping.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 8. How It Works (B2B Sourcing Workflow) */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400 bg-orange-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-amber-800/50">
              Simple 4-Step Wholesale Buying
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3">
              How Buying Works on RealBell BizMart
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
              From order specs to your doorstep in 4 transparent stages.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            
            {/* Step 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative text-center hover:border-amber-400 transition"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
                1
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">Post RFQ</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Submit product specifications, required quantity, target budget, and design files via our quick RFQ form.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative text-center hover:border-amber-400 transition"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
                2
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">Compare Quotes</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive 3 to 5 verified supplier quotes within 24 hours. Compare pricing, MOQs, and lead times.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative text-center hover:border-amber-400 transition"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
                3
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">Sample & Proofing</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Approve pre-production samples. Once you approve the physical sample or batch quote, bulk fulfillment commences.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative text-center hover:border-amber-400 transition"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
                4
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">QC & Delivery</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                On-site AQL 2.5 quality control inspection performed before dispatch. Safe delivery to your business warehouse.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 9. Buyer Testimonials & Real Success Stories */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400 bg-orange-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-amber-800/50">
              Client Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Trusted by Procurement Leaders Across Industries
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            
            {/* Testimonial 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:shadow-xl transition"
            >
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "We sourced 15,000 custom corporate onboarding gift hampers and backpacks through RealBell BizMart. The direct wholesale marketplace pricing saved our procurement department over ₹18 Lakhs compared to traditional distributors."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Arunabh Kulkarni</h4>
                  <p className="text-[11px] text-slate-400">Head of Procurement, FinTech Unicorn</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:shadow-xl transition"
            >
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "Managing school uniform bulk procurement for 22 branch campuses was always chaotic. RealBell's verified Tirupur wholesale partners delivered 40,000 sets 10 days ahead of our academic calendar with zero defect rejection."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  SM
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Dr. Shalini Mathur</h4>
                  <p className="text-[11px] text-slate-400">Director of Operations, K-12 School Chain</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:shadow-xl transition"
            >
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "RealBell Escrow gave us the peace of mind to order heavy-duty industrial workwear and safety boots directly from verified Agra wholesale suppliers. The quality inspection report was 100% accurate."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  VG
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Vikramaditya Gill</h4>
                  <p className="text-[11px] text-slate-400">VP Supply Chain, Infrastructure & Logistics</p>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 10. Supplier Onboarding & Enterprise CTA Banner */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6">
          <span className="inline-block bg-amber-500 text-slate-950 font-semibold text-xs px-4 py-1.5 rounded-full">
            Become a Verified Marketplace Seller
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight">
            Are You an Indian Wholesaler, Brand, or Distributor? <br className="hidden sm:block" />
            Join 50,000+ Verified Sellers on RealBell BizMart
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Get high-volume corporate RFQs, access domestic bulk contracts, and export to 150+ international buyer markets with zero buyer default risk.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/signup')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-7 sm:px-8 py-3.5 rounded-xl shadow-lg transition cursor-pointer text-xs sm:text-sm"
            >
              Register as a Seller Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOpenRFQ({ title: 'Enterprise Procurement Contract' })}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 sm:px-8 py-3.5 rounded-xl border border-white/20 transition text-xs sm:text-sm cursor-pointer"
            >
              Contact Enterprise Sales
            </motion.button>
          </div>
        </div>
      </section>

      {/* 12. Floating Sourcing Assistant (Matching user screenshot) */}
      <SourcingAssistant onOpenRFQ={handleOpenRFQ} />

      {/* 13. Interactive RFQ Modal */}
      <RFQModal
        isOpen={rfqModalOpen}
        onClose={() => setRfqModalOpen(false)}
        initialData={selectedProductForRFQ}
      />

      {/* 14. Slide-Out Wholesale Cart Drawer */}
      <CartModal />

      {/* 15. Footer */}
      <Footer onOpenRFQ={handleOpenRFQ} />

    </div>
  );
};

export default Home;