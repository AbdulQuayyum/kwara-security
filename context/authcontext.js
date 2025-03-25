import React, { createContext, useState, useEffect } from "react";
import NetInfo from '@react-native-community/netinfo';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { isOnline } from "../utilities/network";
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [authState, setAuthState] = useState({
        token: null,
        isAuthenticated: false,
        user: null,
        isOnline: true,
        initialized: false
    });

    const storeToken = async (token) => {
        try {
            await SecureStore.setItemAsync('token', token);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 100);
            await AsyncStorage.setItem('token_expiration', expirationDate.toISOString());
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    const isTokenValid = async () => {
        try {
            const expiration = await AsyncStorage.getItem('token_expiration');
            if (!expiration) return false;

            const expirationDate = new Date(expiration);
            return new Date() < expirationDate;
        } catch (error) {
            console.error('Error checking token validity:', error);
            return false;
        }
    };

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
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return false;
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
            }
            return { success: false, message: response.data.message || "Failed to update profile." };
        } catch (error) {
            console.error("Error updating profile:", error);
            return { success: false, message: "Failed to update profile. Please try again." };
        }
    };

    const login = async (token) => {
        await storeToken(token);
        setAuthState(prev => ({
            ...prev,
            token,
            isAuthenticated: true,
            user: null
        }));

        await fetchUserProfile(token);
    };

    const logout = async () => {
        setAuthState({
            token: null,
            isAuthenticated: false,
            user: null,
            isOnline: authState.isOnline,
            initialized: true
        });

        await SecureStore.deleteItemAsync('token');
        await AsyncStorage.removeItem('token_expiration');
        await AsyncStorage.removeItem('user');
        router.replace("/");
    };

    const checkAuth = async () => {
        try {
            const online = await isOnline();
            const storedToken = await SecureStore.getItemAsync('token');
            const storedUser = await AsyncStorage.getItem('user');
            const tokenValid = storedToken ? await isTokenValid() : false;

            setAuthState(prev => ({
                ...prev,
                isOnline: online,
                initialized: true
            }));

            if (storedToken && tokenValid) {
                setAuthState(prev => ({
                    ...prev,
                    token: storedToken,
                    isAuthenticated: true,
                    user: storedUser ? JSON.parse(storedUser) : null
                }));

                if (online) {
                    await fetchUserProfile(storedToken);
                }
            } else {
                if (storedToken && !tokenValid) {
                    await logout();
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        token: null,
                        isAuthenticated: false,
                        user: null
                    }));
                    router.replace("/");
                }
            }
        } catch (error) {
            console.error('Error in checkAuth:', error);
            setAuthState(prev => ({
                ...prev,
                initialized: true
            }));
        }
    };

    useEffect(() => {
        checkAuth();
        const unsubscribe = NetInfo.addEventListener(state => {
            setAuthState(prev => ({
                ...prev,
                isOnline: state.isConnected
            }));

            if (state.isConnected) {
                checkAuth();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, setAuthState, login, logout, updateUserProfile, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};