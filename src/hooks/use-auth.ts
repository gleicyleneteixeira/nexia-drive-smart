import React, { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  status: string; // 'pendente_pagamento' | 'ativo'
  expires_at: string | null;
  is_migrated: boolean | null;
  is_first_access: boolean | null;
  needs_new_password: boolean | null;
  access_status: string | null;
  group_status: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isMock: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthInternal();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function useAuthInternal() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  const fetchProfileAndRole = async (userId: string) => {
    // 1. Check if mock mode is active
    if (typeof window !== "undefined" && localStorage.getItem("nexia:use_mock_mode") === "true") {
      const mockProfile = localStorage.getItem("nexia:mock_profile");
      if (mockProfile) {
        setProfile(JSON.parse(mockProfile));
      }
      setIsAdmin(localStorage.getItem("nexia:mock_is_admin") === "true");
      setIsMock(true);
      return;
    }

    try {
      // Regular Supabase fetch
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (profileErr) {
        // Retry once for race condition on trigger creation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (!retryError) {
          setProfile(retryData as Profile);
        }
      } else {
        setProfile(profileData as Profile);
      }

      // Fetch admin role
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin");
        
      setIsAdmin(!rolesErr && (roles?.length ?? 0) > 0);
    } catch (err) {
      console.error("Error fetching profile & role:", err);
    }
  };

  useEffect(() => {
    // Check local storage mock mode on initial load
    if (typeof window !== "undefined" && localStorage.getItem("nexia:use_mock_mode") === "true") {
      const mockUser = localStorage.getItem("nexia:mock_user");
      const mockProfile = localStorage.getItem("nexia:mock_profile");
      if (mockUser && mockProfile) {
        setUser(JSON.parse(mockUser));
        setProfile(JSON.parse(mockProfile));
        setIsAdmin(localStorage.getItem("nexia:mock_is_admin") === "true");
        setIsMock(true);
        setLoading(false);
        return;
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfileAndRole(currentUser.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        await fetchProfileAndRole(currentUser.id);
        setLoading(false);
      } else {
        // If mock mode was enabled, let's preserve it unless signing out
        if (localStorage.getItem("nexia:use_mock_mode") === "true") {
          return;
        }
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nexia:use_mock_mode");
      localStorage.removeItem("nexia:mock_user");
      localStorage.removeItem("nexia:mock_profile");
      localStorage.removeItem("nexia:mock_is_admin");
    }
    setIsMock(false);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }

  async function refreshProfile() {
    if (typeof window !== "undefined" && localStorage.getItem("nexia:use_mock_mode") === "true") {
      const mockProfile = localStorage.getItem("nexia:mock_profile");
      if (mockProfile) {
        setProfile(JSON.parse(mockProfile));
      }
      setIsAdmin(localStorage.getItem("nexia:mock_is_admin") === "true");
      setIsMock(true);
      return;
    }
    if (user) {
      await fetchProfileAndRole(user.id);
    }
  }

  return { user, profile, isAdmin, isMock, loading, signOut, refreshProfile };
}
