"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { User as UserProfile } from "../types";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if email is admin
  const checkIsAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    // Check if email is exactly admin@zovallo.com OR starts with admin
    return (
      email === "admin@zovallo.com" || email.toLowerCase().startsWith("admin")
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Try to fetch user profile from Firestore
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create a basic profile if it doesn't exist
            const isAdminUser = checkIsAdmin(currentUser.email);
            const basicProfile = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              role: isAdminUser ? "admin" : "user",
              createdAt: new Date(),
            } as UserProfile;
            setProfile(basicProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Set basic profile even if Firestore fails
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
            role: checkIsAdmin(currentUser.email) ? "admin" : "user",
            createdAt: new Date(),
          } as UserProfile);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user is admin based on email OR profile role
  const isAdmin = checkIsAdmin(user?.email) || profile?.role === "admin";

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
