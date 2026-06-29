"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const FavoritesContext = createContext<{
  favorites: Set<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}>({
  favorites: new Set(),
  addFavorite: () => {},
  removeFavorite: () => {},
});

export function FavoritesProvider({
  children,
  initialFavorites,
}: {
  children: ReactNode;
  initialFavorites: string[];
}) {
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(initialFavorites)
  );

  function addFavorite(id: string) {
    setFavorites(prev => new Set([...prev, id]));
  }

  function removeFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}