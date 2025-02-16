import { useEffect, useRef, useContext } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import { useRouter, usePathname } from "expo-router";

import { AuthContext } from "../context/authcontext";
import routes from "../routes/index";
import images from "../assets/images/index";
import styles from "../styles/bottomnavigation";

const BottomNavigation = () => {
    const { authState } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    const dataList = authState?.user?.isAdmin
        ? [
            {
                path: routes.home,
                activeIcon: images.activehome,
                inactiveIcon: images.inactivehome,
            },
            {
                path: routes.profile,
                activeIcon: images.activeprofile,
                inactiveIcon: images.inactiveprofile,
            },
            {
                path: routes.cases,
                activeIcon: images.activecases,
                inactiveIcon: images.inactivecases,
            },
            {
                path: routes.users,
                activeIcon: images.activedocuments,
                inactiveIcon: images.inactivedocuments,
            }
        ]
        : [
            {
                path: routes.home,
                activeIcon: images.activehome,
                inactiveIcon: images.inactivehome,
            },
            {
                path: routes.profile,
                activeIcon: images.activeprofile,
                inactiveIcon: images.inactiveprofile,
            }
        ];

    const handleItemPress = (item) => {
        if (pathname !== item.path) {
            router.push(item.path);
        }
    };

    return (
        <>
            <View style={styles.mainContainer} >
                <View style={styles.container}>
                    <View style={styles.navigationWrapper}>
                        {dataList.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <TouchableOpacity key={index} onPress={() => handleItemPress(item)} style={[styles.navItem, isActive && styles.activeNavItem]} >
                                    <View style={styles.iconWrapper}>
                                        <Image source={isActive ? item.activeIcon : item.inactiveIcon} style={styles.icon} />
                                        {isActive && (
                                            <View style={styles.activeDot} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </>
    );
};

export default BottomNavigation;
