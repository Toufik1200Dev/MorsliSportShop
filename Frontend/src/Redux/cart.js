import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // array of product objects
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if product already in cart (by id and delivery type and wilaya)
      const exists = state.items.find(item => 
        item.id === action.payload.id && 
        item.deliveryType === action.payload.deliveryType &&
        item.selectedWilaya === action.payload.selectedWilaya &&
        item.selectedSize === action.payload.selectedSize
      );
      
      if (!exists) {
        state.items.push({ ...action.payload });
      } else {
        exists.quantity += action.payload.quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;