import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import * as SecureStore from "expo-secure-store";

const USER_ID_KEY = "campus_library_user_id";

interface AuthUser {
  _id: Id<"users">;
  name: string;
  nim: string;
  email: string;
  digitalId: string;
  memberStatus: string;
  createdAt: number;
}

interface AuthState {
  user: AuthUser | null;
  userId: Id<"users"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userId: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);

  // load userId dari SecureStore saat app pertama dibuka
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync(USER_ID_KEY);
      if (storedUserId) {
        setAuthState((prev) => ({
          ...prev,
          userId: storedUserId as Id<"users">,
          isLoading: false,
          isAuthenticated: true,
        }));
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(
    async (nim: string, password: string) => {
      try {
        const result = await loginMutation({ nim, password });

        if (result.success && result.user) {
          // simpan userId ke SecureStore
          await SecureStore.setItemAsync(USER_ID_KEY, result.user._id);

          setAuthState({
            user: result.user as AuthUser,
            userId: result.user._id as Id<"users">,
            isLoading: false,
            isAuthenticated: true,
          });

          return { success: true };
        }

        return { success: false, error: "Login gagal." };
      } catch (error: any) {
        return { success: false, error: error.message ?? "Login gagal." };
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (name: string, nim: string, email: string, password: string) => {
      try {
        const result = await registerMutation({ name, nim, email, password });

        if (result.success) {
          return { success: true };
        }

        return { success: false, error: "Registrasi gagal." };
      } catch (error: any) {
        return { success: false, error: error.message ?? "Registrasi gagal." };
      }
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    setAuthState({
      user: null,
      userId: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
  };
}