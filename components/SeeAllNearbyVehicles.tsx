import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Keyboard,
    Platform,
    Dimensions,
    Modal,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { dummyVehicles } from '@/utils/static-data/vehicles-data';

interface SeeAllNearbyVehiclesScreenProps {
    onShowUI: (show: boolean) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_HEIGHT = 60; // Adjust based on your tab height

const SeeAllNearbyVehiclesScreen: React.FC<SeeAllNearbyVehiclesScreenProps> = ({ onShowUI }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState(dummyVehicles);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<typeof dummyVehicles[0] | null>(null);
    const [isFullScreenMapVisible, setIsFullScreenMapVisible] = useState(false);


    // Memoized filtered vehicles to optimize performance
    const memoizedFilteredVehicles = useMemo(() => {
        if (searchQuery.trim() === '') return dummyVehicles;

        const query = searchQuery.toLowerCase();
        return dummyVehicles.filter(vehicle =>
            vehicle.route.toLowerCase().includes(query) ||
            vehicle.type.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    useEffect(() => {
        setFilteredVehicles(memoizedFilteredVehicles);
    }, [memoizedFilteredVehicles]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            // Simulate data refresh
            console.log('Data refreshed');
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleVehicleSelect = (vehicle: typeof dummyVehicles[0]) => {
        setSelectedVehicle(vehicle);
    };

    const toggleFullScreenMap = () => {
        setIsFullScreenMapVisible(!isFullScreenMapVisible);
    };

    const renderMapSection = () => (
        <View style={styles.mapContainer}>
            {filteredVehicles.length > 0 && (
                <>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: filteredVehicles[0].latitude,
                            longitude: filteredVehicles[0].longitude,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                        showsUserLocation={true}
                        scrollEnabled={true}
                        zoomEnabled={true}
                    >
                        {filteredVehicles.map((vehicle) => (
                            <Marker
                                key={vehicle.id}
                                coordinate={{
                                    latitude: vehicle.latitude,
                                    longitude: vehicle.longitude
                                }}
                                title={`${vehicle.type} - ${vehicle.route}`}
                                description={`ETA: ${vehicle.eta} | Fare: ${vehicle.fare}`}
                                pinColor={selectedVehicle?.id === vehicle.id ? '#FF6347' : '#4A90E2'}
                                onPress={() => handleVehicleSelect(vehicle)}
                            />
                        ))}
                    </MapView>
                    <TouchableOpacity
                        style={styles.fullScreenMapButton}
                        onPress={toggleFullScreenMap}
                    >
                        <Ionicons name="expand" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    // Full Screen Map Modal
    const renderFullScreenMap = () => (
        <Modal
            visible={isFullScreenMapVisible}
            animationType="slide"
            transparent={false}
        >
            <View style={styles.fullScreenModalContainer}>
                <TouchableOpacity
                    style={styles.closeFullScreenMapButton}
                    onPress={toggleFullScreenMap}
                >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <MapView
                    style={styles.fullScreenMap}
                    initialRegion={{
                        latitude: filteredVehicles[0].latitude,
                        longitude: filteredVehicles[0].longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    showsUserLocation={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                >
                    {filteredVehicles.map((vehicle) => (
                        <Marker
                            key={vehicle.id}
                            coordinate={{
                                latitude: vehicle.latitude,
                                longitude: vehicle.longitude
                            }}
                            title={`${vehicle.type} - ${vehicle.route}`}
                            description={`ETA: ${vehicle.eta} | Fare: ${vehicle.fare}`}
                            pinColor={selectedVehicle?.id === vehicle.id ? '#FF6347' : '#4A90E2'}
                            onPress={() => handleVehicleSelect(vehicle)}
                        />
                    ))}
                </MapView>
            </View>
        </Modal>
    );


    const renderVehicleItem = ({ item }: { item: typeof dummyVehicles[0] }) => (
        <TouchableOpacity
            style={[
                styles.vehicleItem,
                selectedVehicle?.id === item.id && styles.selectedVehicleItem,
            ]}
            onPress={() => handleVehicleSelect(item)}
        >
            <View style={styles.vehicleItemContent}>
                <View>
                    <Text style={styles.vehicleType}>{item.type}</Text>
                    <Text
                        style={styles.vehicleRoute}
                        numberOfLines={1} // Limit the text to 1 line
                        ellipsizeMode="tail" // Add ellipsis at the end
                    >
                        {item.route}
                    </Text>
                </View>
                <Text style={styles.vehicleEtaFare}>
                    {item.eta} | {item.fare}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredVehicles}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4A90E2']}
                        tintColor="#4A90E2"
                    />
                }
                ListHeaderComponent={
                    <View>
                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
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

                        {/* Map Section */}
                        {renderMapSection()}

                        {/* Section Title */}
                        <Text style={styles.sectionTitle}>
                            {filteredVehicles.length} Vehicles Available
                        </Text>
                    </View>
                }
                renderItem={renderVehicleItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No vehicles found for "{searchQuery}"
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Try a different search term
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={<View style={styles.listFooter} />}
            />

            {/* Full Screen Map Modal */}
            {renderFullScreenMap()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A237E',
        margin: 15,
    },
    vehicleItem: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    selectedVehicleItem: {
        backgroundColor: '#E6F2FF',
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
    },
    vehicleItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    vehicleInfoContainer: {
        flex: 1, // This will allow the container to take available space
        marginRight: 10, // Add some margin to separate it from the fare text
    },
    vehicleType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A237E',
    },
    vehicleRoute: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        overflow: 'hidden', // Ensure that overflowing text is hidden
        // You can set a maximum width here if needed
    },
    vehicleEtaFare: {
        fontSize: 12,
        color: '#4A90E2',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 10,
    },
    listContainer: {
        paddingBottom: TAB_HEIGHT + 20,
    },
    listFooter: {
        height: TAB_HEIGHT + 20,
    },
    vehicleLocation: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    vehicleMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandButton: {
        marginLeft: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    mapContainer: {
        position: 'relative',
        marginHorizontal: 15,
    },
    map: {
        height: SCREEN_HEIGHT * 0.25,
        borderRadius: 12,
    },
    fullScreenMapButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        padding: 10,
    },
    fullScreenModalContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    fullScreenMap: {
        flex: 1,
    },
    closeFullScreenMapButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        padding: 10,
    },
});

export default SeeAllNearbyVehiclesScreen;