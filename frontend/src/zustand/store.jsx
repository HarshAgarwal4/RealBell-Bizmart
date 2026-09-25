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

export const useStore = create((set, get) => ({
    user: null,
    isLoading: true,
    setIsLoading: (data) => set({ isLoading: data }),
    setUser: (data) => set({ user: data }),
    
    // Cart State
    cart: getInitialCart(),
    isCartOpen: false,
    setIsCartOpen: (open) => set({ isCartOpen: open }),

    addToCart: (product, qty = null) => {
        const currentCart = get().cart;
        const quantityToAdd = qty || product.moq || 1;
        const existingIdx = currentCart.findIndex(item => item._id === product._id);

        let newCart;
        if (existingIdx > -1) {
            newCart = currentCart.map((item, idx) => 
                idx === existingIdx ? { ...item, quantity: item.quantity + quantityToAdd } : item
            );
        } else {
            newCart = [...currentCart, {
                _id: product._id,
                title: product.title,
                price: product.price,
                moq: product.moq || 1,
                unit: product.unit || 'pcs',
                quantity: quantityToAdd,
                image: product.images && product.images[0] ? product.images[0] : (product.image || ''),
                seller: product.seller || null,
                sellerName: product.sellerName || product.shopName || 'Verified Seller'
            }];
        }

        localStorage.setItem('realbell_cart', JSON.stringify(newCart));
        set({ cart: newCart, isCartOpen: true });
        toast.success(`Added ${product.title.slice(0, 25)}... to cart!`);
    },

    removeFromCart: (productId) => {
        const newCart = get().cart.filter(item => item._id !== productId);
        localStorage.setItem('realbell_cart', JSON.stringify(newCart));
        set({ cart: newCart });
        toast.info("Item removed from cart");
    },

    updateCartQty: (productId, newQty) => {
        if (newQty < 1) return;
        const newCart = get().cart.map(item => 
            item._id === productId ? { ...item, quantity: newQty } : item
        );
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

    logoutUser: async () => {
        try {
            await axios.post('/logout');
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (err) {
            console.log(err);
            set({ user: null });
        }
    }
}));