/* import { Vehicle } from "@/utils/static-data/vehicles-data";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Keyboard } from "react-native";

interface MapSectionProps {
    vehicles: Vehicle[];
    onVehicleSelect?: (vehicle: Vehicle) => void;
    setSeeAllVehicles: (value: boolean) => void;
}

const MapViewScreen: React.FC<MapSectionProps> = ({ vehicles, onVehicleSelect, setSeeAllVehicles }) => {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const mapRef = useRef<MapView | null>(null);
    const markerRefs = useRef<Record<number, any | null>>({});

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Location permission denied");
                return;
            }
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setCurrentLocation(location);
        })();
    }, []);

    const centerOnLocation = () => {
        if (currentLocation?.coords && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                },
                1000
            );
        }
    };

    const handleVehiclePress = (vehicle: Vehicle) => {
        setSelectedVehicleId(vehicle.id);
        markerRefs.current[vehicle.id]?.showCallout();
        mapRef.current?.animateToRegion(
            {
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            },
            1000
        );
        onVehicleSelect?.(vehicle);
    };

    const getVehicleIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "bus":
                return "bus";
            case "jeepney":
                return "bus";
            case "uv":
                return "car";
            default:
                return "car";
        }
    };

    const filteredVehicles = filterType ? vehicles.filter((v) => v.type.toLowerCase() === filterType.toLowerCase()) : vehicles;

    const getMarkerColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "bus":
                return "#4CAF50";
            case "jeepney":
                return "#2196F3";
            case "uv":
                return "#FF9800";
            default:
                return "#4A90E2";
        }
    };

    return (
        <View style={styles.mapContainer}>
            <View style={styles.mapHeader}>
                <Text style={styles.sectionTitle}>Nearby Vehicles</Text>
                <TouchableOpacity onPress={() => setSeeAllVehicles(true)}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={[styles.filterButton, !filterType && styles.filterButtonActive]} onPress={() => setFilterType(null)}>
                    <Text style={[styles.filterText, !filterType && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                {["Jeepney", "Bus", "UV"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.filterButton, filterType === type.toLowerCase() && styles.filterButtonActive]}
                        onPress={() => setFilterType(type.toLowerCase())}
                    >
                        <Ionicons name={getVehicleIcon(type)} size={16} color={filterType === type.toLowerCase() ? "#FFF" : "#666"} />
                        <Text style={[styles.filterText, filterType === type.toLowerCase() && styles.filterTextActive]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.mapWrapper}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: currentLocation?.coords.latitude || 14.5995,
                        longitude: currentLocation?.coords.longitude || 120.9842,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    showsUserLocation
                    showsCompass
                    showsTraffic
                >
                    {currentLocation?.coords && (
                        <Circle center={currentLocation.coords} radius={500} fillColor="rgba(66, 133, 244, 0.2)" strokeWidth={1} />
                    )}

                    {filteredVehicles.map((vehicle) => (
                        <Marker
                            ref={(ref) => (markerRefs.current[vehicle.id] = ref)}
                            key={vehicle.id}
                            coordinate={{ latitude: vehicle.latitude, longitude: vehicle.longitude }}
                            onPress={() => handleVehiclePress(vehicle)}
                        >
                            <View style={[styles.customMarker, { borderColor: getMarkerColor(vehicle.type) }]}>
                                <Ionicons name={getVehicleIcon(vehicle.type)} size={24} color={getMarkerColor(vehicle.type)} />
                            </View>
                            <Callout tooltip>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{vehicle.type}</Text>
                                    <Text style={styles.calloutRoute}>{vehicle.route}</Text>
                                    <Text style={styles.calloutDetails}>ETA: {vehicle.eta}</Text>
                                    <Text style={styles.calloutDetails}>Fare: {vehicle.fare}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                <View style={styles.mapControls}>
                    <TouchableOpacity style={styles.controlButton} onPress={centerOnLocation}>
                        <Ionicons name="locate" size={24} color="#4A90E2" />
                    </TouchableOpacity>
                </View>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search routes or vehicle type"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={Keyboard.dismiss}
                clearButtonMode="while-editing"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: { margin: 20, borderRadius: 12, overflow: "hidden", backgroundColor: "#FFF" },
    mapHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15 },
    filterContainer: { flexDirection: "row", paddingHorizontal: 15, paddingBottom: 10, gap: 8 },
    filterButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#F5F5F5", gap: 4 },
    filterButtonActive: { backgroundColor: "#4A90E2" },
    filterText: { fontSize: 12, color: "#666" },
    filterTextActive: { color: "#FFF" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A237E" },
    seeAllText: { color: "#4A90E2", fontSize: 14, fontWeight: "500" },
    mapWrapper: { height: 300 },
    map: { ...StyleSheet.absoluteFillObject },
    customMarker: { backgroundColor: "white", padding: 8, borderRadius: 20, borderWidth: 2 },
    calloutContainer: { backgroundColor: "white", padding: 10, borderRadius: 8 },
    calloutTitle: { fontWeight: "bold", fontSize: 16 },
    calloutRoute: { fontSize: 14 },
    calloutDetails: { fontSize: 12, color: "#555" },
    controlButton: { position: "absolute", bottom: 10, right: 10, backgroundColor: "white", padding: 8, borderRadius: 30, elevation: 3 },
    mapControls: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        gap: 8,
    },
    searchInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
});

export default MapViewScreen;
 */