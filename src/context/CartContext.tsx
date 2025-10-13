'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// --- TYPE DEFINITIONS ---

// For items currently in the shopping cart
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// For items that were part of the last successful order
interface LastOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

// For the last successful order object that we want to store
interface LastOrder {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: LastOrderItem[];
  totalAmount: number;
  paymentReference?: string;
  createdAt: Date;
}

// The complete shape of our global cart state
interface CartState {
  items: CartItem[];
  lastSuccessfulOrder: LastOrder | null; // <-- NEW STATE PROPERTY
}

// All possible actions that can be dispatched to the reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LAST_ORDER'; payload: LastOrder }; // <-- NEW ACTION TYPE

// The context that will be provided to components
const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);


// The reducer function to handle state updates
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload }] };
    }
    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    case 'CLEAR_CART': {
      // Clearing the cart should NOT clear the last successful order
      return { ...state, items: [] };
    }
    case 'SET_LAST_ORDER': { // <-- NEW REDUCER CASE
      return { ...state, lastSuccessfulOrder: action.payload };
    }
    default: {
      return state;
    }
  }
};

// The provider component that wraps parts of your app
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with an empty items array and null for the last order
  const [state, dispatch] = useReducer(cartReducer, { items: [], lastSuccessfulOrder: null });
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// The custom hook for easy access to the context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};