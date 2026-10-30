
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const refreshCart = useCallback(async () => {
    let userData;

    try {
      userData = JSON.parse(
        localStorage.getItem("userData") || "null"
      );
    } catch {
      userData = null;
    }

    const userId = userData?._id;
    const token = userData?.token;

    if (
      !userId ||
      !token ||
      !userData?.isLoginStatus ||
      userData?.role === "admin"
    ) {
      setCartCount(0);
      setTotalPrice(0);
      return;
    }

    try {
      const res = await WebServices.getAPIUsingToken(
        `${WebAPI.fetchCart}/${userId}`,
        token
      );

      const items = res.data?.data?.items || [];

      setCartCount(items.length);

      const total = items.reduce((sum, item) => {
        return (
          sum +
          Number(
            item.serviceId?.service_price ?? item.price ?? 0
          )
        );
      }, 0);

      setTotalPrice(total);
    } catch {
      setCartCount(0);
      setTotalPrice(0);
    }
  }, []);

  useEffect(() => {
    refreshCart();

    const handleLogin = () => {
      refreshCart();
    };

    const handleLogout = () => {
      setCartCount(0);
      setTotalPrice(0);
    };

    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener("userLogin", handleLogin);
    window.addEventListener("userLogout", handleLogout);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("userLogin", handleLogin);
      window.removeEventListener("userLogout", handleLogout);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        totalPrice,
        setTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

