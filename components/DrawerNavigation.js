import { useEffect, useRef, useContext, useState } from "react";
import { View, Image, TouchableOpacity, Animated, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/authcontext";
import routes from "../routes/index";
import images from "../assets/images/index";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

const DrawerNavigation = () => {
    const { authState } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const dataList = authState?.user?.isAdmin
        ? [
            {
                path: routes.analytics,
                name: "Analytics",
                activeIcon: images.activeanalytics,
                inactiveIcon: images.inactiveanalytics
            },
            {
                path: routes.home,
                name: "Home",
                activeIcon: images.activehome,
                inactiveIcon: images.inactivehome
            },
            {
                path: routes.cases,
                name: "Cases",
                activeIcon: images.activecases,
                inactiveIcon: images.inactivecases
            },
            {
                path: routes.users,
                name: "Users",
                activeIcon: images.activeusers,
                inactiveIcon: images.inactiveusers
            },
            {
                path: routes.settings,
                name: "Settings",
                activeIcon: images.activesettings,
                inactiveIcon: images.inactivesettings
            }
        ]
        : [
            {
                path: routes.home,
                name: "Home",
                activeIcon: images.activehome,
                inactiveIcon: images.inactivehome
            },
            {
                path: routes.settings,
                name: "Settings",
                activeIcon: images.activesettings,
                inactiveIcon: images.inactivesettings
            }
        ];

    const toggleDrawer = () => {
        if (drawerOpen) {
            // Close drawer
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: -DRAWER_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setDrawerOpen(false);
            });
        } else {
            // Open drawer
            setDrawerOpen(true);
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const handleItemPress = (item) => {
        if (pathname !== item.path) {
            router.push(item.path);
            toggleDrawer(); // Close drawer after navigation
        }
    };

    // Close drawer when clicking outside
    const handleBackdropPress = () => {
        if (drawerOpen) {
            toggleDrawer();
        }
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            <TouchableOpacity
                style={styles.menuButton}
                onPress={toggleDrawer}
            >
                <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>

            {/* Backdrop */}
            {drawerOpen && (
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: backdropOpacity }
                    ]}
                    onTouchStart={handleBackdropPress}
                />
            )}

            {/* Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    { transform: [{ translateX }] }
                ]}
            >
                <SafeAreaView style={styles.drawerContent}>
                    <View style={styles.drawerHeader}>
                        <Text style={styles.drawerTitle}>Menu</Text>
                        <TouchableOpacity onPress={toggleDrawer}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.drawerItems}>
                        {dataList.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleItemPress(item)}
                                    style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
                                >
                                    <Image
                                        source={isActive ? item.activeIcon : item.inactiveIcon}
                                        style={styles.drawerItemIcon}
                                    />
                                    <Text style={[styles.drawerItemText, isActive && styles.activeDrawerItemText]}>
                                        {item.name}
                                    </Text>
                                    {isActive && <View style={styles.activeDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </SafeAreaView>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 100,
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 90,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: 'white',
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 50,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    drawerItems: {
        marginTop: 20,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    activeDrawerItem: {
        backgroundColor: '#f8f8f8',
    },
    drawerItemIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    drawerItemText: {
        fontSize: 16,
        color: '#333',
    },
    activeDrawerItemText: {
        fontWeight: 'bold',
        color: '#000',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginLeft: 'auto',
    },
});

export default DrawerNavigation;