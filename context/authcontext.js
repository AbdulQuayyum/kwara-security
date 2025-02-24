import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [authState, setAuthState] = useState({
        token: null,
        isAuthenticated: false,
        user: null,
    });

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.post(
                "https://kwara-security-api-production.up.railway.app/v1/user/get-user-profile",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const userData = response.data.data;
                setAuthState((prevState) => ({
                    ...prevState,
                    user: userData,
                }));
                await AsyncStorage.setItem("user", JSON.stringify(userData));
            } else {
                logout();
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            logout();
        }
    };

    const updateUserProfile = async (updatedProfile) => {
        try {
            const response = await axios.post(
                "https://kwara-security-api-production.up.railway.app/v1/user/update-user-profile",
                updatedProfile,
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );

            if (response.data.success) {
                setAuthState((prevState) => ({
                    ...prevState,
                    user: { ...prevState.user, ...updatedProfile },
                }));

                await AsyncStorage.setItem("user", JSON.stringify({ ...authState.user, ...updatedProfile }));

                return { success: true, message: "Profile updated successfully!" };
            } else {
                return { success: false, message: response.data.message || "Failed to update profile." };
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            return { success: false, message: "Failed to update profile. Please try again." };
        }
    };

    const login = async (token) => {
        setAuthState({
            token,
            isAuthenticated: true,
            user: null,
        });

        await AsyncStorage.setItem("token", token);
        fetchUserProfile(token);
    };

    const logout = async () => {
        setAuthState({
            token: null,
            isAuthenticated: false,
            user: null,
        });

        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/");
    };

    useEffect(() => {
        const loadAuthState = async () => {
            const storedToken = await AsyncStorage.getItem("token");

            if (storedToken) {
                setAuthState({
                    token: storedToken,
                    isAuthenticated: true,
                    user: null,
                });
                fetchUserProfile(storedToken);
            } else {
                router.replace("/");
            }
        };

        loadAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, setAuthState, login, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
