import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: "center",
        width: "100%",
    },
    container: {
        backgroundColor: "#FFF",
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxWidth: 500,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    navigationWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    navItem: {
        position: "relative",
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
    },
    activeNavItem: {
        backgroundColor: "#CCC",
        paddingVertical: 27
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 24,
        height: 24,
    },
    activeDot: {
        width: 5,
        height: 5,
        backgroundColor: "#000",
        borderRadius: 5,
        position: "absolute",
        bottom: -15,
    },
    inactiveDot: {
        width: 5,
        height: 5,
        backgroundColor: "transparent",
        borderRadius: 5,
        position: "absolute",
        bottom: -15,
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: "#888",
    },
    activeNavText: {
        color: "#000",
        fontWeight: "bold",
    },
});

export default styles;
