import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart): []
      }
      const [data] = useState(db);
      const [cart, setCart] = useState(initialCart);
      const MAX_ITEM = 5;
      const MIN_ITEM = 1;
    
      useEffect(() =>{
        localStorage.setItem('cart', JSON.stringify(cart))
      }, [cart])
    
      function addToCart(item) {
        const itemIndex = cart.findIndex(guitar => guitar.id === item.id);
      
        if (itemIndex >= 0) {
          const updatedCart = [...cart];
          if (updatedCart[itemIndex].quantity === MAX_ITEM) {
            return; // No se permite añadir más si alcanza la cantidad máxima
          }
          updatedCart[itemIndex] = {
            ...updatedCart[itemIndex],
            quantity: updatedCart[itemIndex].quantity + 1,
          };
          setCart(updatedCart);
        } else {
          setCart([...cart, { ...item, quantity: 1 }]); // Añade el nuevo ítem al carrito
        }
      }  
    
      function removeFromCart (id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
      }
    
      function increaseQuantity(id) {
        const updatedCart = cart.map(item =>
          item.id === id && item.quantity < MAX_ITEM
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart);
      }  
    
      function decreaseQuantity(id) {
        const updatedCart = cart.map(item => 
          item.id === id && item.quantity > MIN_ITEM
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        setCart(updatedCart);
      }
    
      const clearCart = () => setCart([]);

    //   State Derivado
      const isEmpty = useMemo(() => cart.length === 0, [cart]);
      const cartTotal = useMemo(
        () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
        [cart]
      );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
