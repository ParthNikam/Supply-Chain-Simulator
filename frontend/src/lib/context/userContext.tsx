"use client";

import { useEffect, useState, useContext, createContext, ReactNode } from "react";
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(pb.authStore.record);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Set initial auth state
    setUser(pb.authStore.record);
    setLoading(false);

    // Subscribe to auth state changes
    pb.authStore.onChange((token, model) => {
      setUser(model);
      if (!model) {
        router.push('/login');
      }
    });

    // Check if we're authenticated
    if (!pb.authStore.isValid) {
      router.push('/login');
    }
  }, [router]);

  const value = {
    user,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
