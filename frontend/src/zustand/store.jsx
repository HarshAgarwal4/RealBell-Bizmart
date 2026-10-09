import { create } from 'zustand';
import axios from '../services/axios';
import { toast } from 'react-toastify';

const getInitialCart = () => {
    try {
        const saved = localStorage.getItem('realbell_cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export const calculateWholesaleTierPrice = (product, quantity) => {
    if (!product?.wholesaleTiers || product.wholesaleTiers.length === 0) {
        return Number(product?.price) || 0;
    }
    const sortedTiers = [...product.wholesaleTiers].sort((a, b) => a.minQty - b.minQty);
    let matchedPrice = sortedTiers[0].unitPrice;
    for (const tier of sortedTiers) {
        if (quantity >= tier.minQty) {
            matchedPrice = tier.unitPrice;
        }
    }
    return matchedPrice;
};

export const useStore = create((set, get) => ({
    user: null,
    isLoading: true,
    setIsLoading: (data) => set({ isLoading: data }),
    setUser: (data) => set({ user: data }),
    
    // Cart State
    cart: getInitialCart(),
    isCartOpen: false,
    setIsCartOpen: (open) => set({ isCartOpen: open }),

    addToCart: (product, qty = null, purchaseType = 'normal') => {
        const currentCart = get().cart;
        const isWholesale = purchaseType === 'wholesale';
        const defaultMinQty = isWholesale ? (product.moq || (product.wholesaleTiers?.[0]?.minQty || 10)) : 1;
        const quantityToAdd = qty ? Math.max(qty, isWholesale ? defaultMinQty : 1) : defaultMinQty;
        
        const unitPrice = isWholesale 
            ? calculateWholesaleTierPrice(product, quantityToAdd)
            : (Number(product.price) || 0);

        const cartItemId = `${product._id}_${purchaseType}`;
        const existingIdx = currentCart.findIndex(item => 
            (item.cartItemId && item.cartItemId === cartItemId) || 
            (!item.cartItemId && item._id === product._id && (item.purchaseType || 'normal') === purchaseType)
        );

        let newCart;
        if (existingIdx > -1) {
            newCart = currentCart.map((item, idx) => {
                if (idx !== existingIdx) return item;
                const newQuantity = item.quantity + quantityToAdd;
                const updatedPrice = item.purchaseType === 'wholesale' 
                    ? calculateWholesaleTierPrice(item, newQuantity)
                    : item.price;
                return {
                    ...item,
                    quantity: newQuantity,
                    price: updatedPrice
                };
            });
        } else {
            newCart = [...currentCart, {
                cartItemId,
                _id: product._id,
                title: product.title,
                price: unitPrice,
                normalPrice: product.price,
                purchaseType: purchaseType,
                moq: defaultMinQty,
                wholesaleTiers: product.wholesaleTiers || [],
                unit: product.unit || 'pcs',
                quantity: quantityToAdd,
                image: product.images && product.images[0] ? product.images[0] : (product.image || ''),
                seller: product.seller || null,
                sellerName: product.sellerName || product.shopName || 'Verified Seller'
            }];
        }

        localStorage.setItem('realbell_cart', JSON.stringify(newCart));
        set({ cart: newCart, isCartOpen: true });
        toast.success(`Added to cart (${purchaseType === 'wholesale' ? 'Wholesale Batch' : 'Normal Item'})!`);
    },

    removeFromCart: (cartItemIdOrProdId) => {
        const newCart = get().cart.filter(item => 
            item.cartItemId !== cartItemIdOrProdId && item._id !== cartItemIdOrProdId
        );
        localStorage.setItem('realbell_cart', JSON.stringify(newCart));
        set({ cart: newCart });
        toast.info("Item removed from cart");
    },

    updateCartQty: (cartItemIdOrProdId, newQty) => {
        const itemToUpdate = get().cart.find(item => 
            item.cartItemId === cartItemIdOrProdId || item._id === cartItemIdOrProdId
        );
        if (!itemToUpdate) return;
        
        const minQty = itemToUpdate.purchaseType === 'wholesale' ? (itemToUpdate.moq || 1) : 1;
        if (newQty < minQty) {
            toast.warning(`Minimum constraint for wholesale purchase is ${minQty} ${itemToUpdate.unit || 'pcs'}`);
            return;
        }

        const newCart = get().cart.map(item => {
            if (item.cartItemId === cartItemIdOrProdId || item._id === cartItemIdOrProdId) {
                const updatedPrice = item.purchaseType === 'wholesale'
                    ? calculateWholesaleTierPrice(item, newQty)
                    : item.price;
                return { ...item, quantity: newQty, price: updatedPrice };
            }
            return item;
        });
        localStorage.setItem('realbell_cart', JSON.stringify(newCart));
        set({ cart: newCart });
    },

    clearCart: () => {
        localStorage.removeItem('realbell_cart');
        set({ cart: [] });
    },

    fetchUser: async () => {
        try {
            let r = await axios.post('/me');
            if (r.status === 200) {
                if (r.data.status === 0) {
                    set({ user: null });
                    return;
                }
                if (r.data.status === 1) {
                    set({ user: r.data.user });
                    return r.data.user;
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            set({ isLoading: false });
        }
    },

    updateUserProfile: async (profileData) => {
        try {
            let res = await axios.post('/profile', profileData);
            if (res.data && res.data.status === 1) {
                set({ user: res.data.user });
                toast.success(res.data.msg || "Profile updated successfully!");
                return { success: true, user: res.data.user };
            } else {
                toast.error(res.data?.msg || "Failed to update profile");
                return { success: false, msg: res.data?.msg };
            }
        } catch (err) {
            console.error("updateUserProfile error:", err);
            toast.error("Network error while updating profile");
            return { success: false, msg: err.message };
        }
    },

    // Notifications State
    unreadNotificationsCount: 0,
    setUnreadNotificationsCount: (count) => set({ unreadNotificationsCount: Math.max(0, count) }),
    fetchUnreadNotificationsCount: async () => {
        try {
            const res = await axios.get('/notifications/my?limit=1');
            if (res.data && res.data.status === 1) {
                set({ unreadNotificationsCount: res.data.unreadCount || 0 });
            }
        } catch (err) {
            // Silently ignore if not logged in
        }
    },

    logoutUser: async () => {
        try {
            await axios.post('/logout');
            set({ user: null, unreadNotificationsCount: 0 });
            toast.success("Logged out successfully");
        } catch (err) {
            console.log(err);
            set({ user: null, unreadNotificationsCount: 0 });
        }
    }
}));