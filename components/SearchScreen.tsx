import React, { useState, useCallback, useMemo } from "react";
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Predefined list of Philippine locations (can be expanded)
const locations = [
    { id: "1", name: "SM Megamall" },
    { id: "2", name: "Ayala Center" },
    { id: "3", name: "Bonifacio Global City" },
    { id: "4", name: "Mall of Asia" },
    { id: "5", name: "Alabang Town Center" },
    { id: "6", name: "Trinoma" },
    { id: "7", name: "Quezon Memorial Circle" },
    { id: "8", name: "Divisoria" },
    { id: "9", name: "Greenbelt" },
    { id: "10", name: "Robinsons Galleria" },
    { id: "11", name: "Ortigas Center" },
    { id: "12", name: "Intramuros" },
    { id: "13", name: "Makati CBD" },
    { id: "14", name: "NAIA Terminal 3" },
    { id: "15", name: "SM City Cebu" },
];

const SearchScreen = ({ onSelectLocation }: any) => {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");

    // Optimized search function
    const filteredResults = useMemo(() => {
        if (!query.trim()) return locations; // Show all locations when query is empty
        return locations.filter((location) =>
            location.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    // Handles selecting a location
    const selectLocation = useCallback(
        (place: any) => {
            if (onSelectLocation) {
                onSelectLocation(place);
            }
        },
        [onSelectLocation]
    );
    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Where would you like to go?"
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="words"
                />
            </View>

            {/* Auto-Suggested Locations */}
            <FlatList
                data={filteredResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => selectLocation(item)}
                    >
                        <Ionicons name="location-outline" size={20} color="#4A90E2" />
                        <Text style={styles.resultText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noResults}>No results found</Text>}
            />

        </View>
    );
};

export default React.memo(SearchScreen); // Memoize for performance

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        padding: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        height: 55,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    resultItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    resultText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 10,
    },
    noResults: {
        textAlign: "center",
        fontSize: 16,
        color: "#999",
        marginTop: 20,
    },
});
