import SearchScreen from '@/components/SearchScreen';
import SeeAllNearbyVehiclesScreen from '@/components/SeeAllNearbyVehicles';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import '../../global.css'

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [seeAllVehicles, setSeeAllVehicles] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    maxFare: null,
    preferredType: null,
    accessibility: false,
  });

  // Enhanced dummy data with more relevant information
  const dummyVehicles = [
    {
      id: 1,
      type: 'Jeepney',
      route: 'Guadalupe - Pateros',
      eta: '5 mins',
      fare: '₱15',
      capacity: '10/16',
      accessibility: true,
      lastUpdated: '2 mins ago',
      driverRating: 4.5
    },
    {
      id: 2,
      type: 'Bus',
      route: 'Alabang - Navotas',
      eta: '10 mins',
      fare: '₱45',
      capacity: '25/40',
      accessibility: true,
      lastUpdated: '1 min ago',
      driverRating: 4.8
    },
    {
      id: 3,
      type: 'UV Express',
      route: 'SM North - Fairview',
      eta: '3 mins',
      fare: '₱35',
      capacity: '8/10',
      accessibility: false,
      lastUpdated: '5 mins ago',
      driverRating: 4.2
    }
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLocationSelect = (location: any) => {
    console.log('Selected location:', location);
    setIsSearchVisible(false);
  };

  if (seeAllVehicles) {
    return <SeeAllNearbyVehiclesScreen onShowUI={setSeeAllVehicles} />;
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center p-5 pt-10 bg-white">
          <View>
            <Text className="text-2xl font-bold text-indigo-900">Good Morning!</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={16} color="#4A90E2" />
              <Text className="text-sm text-gray-600 ml-1">Current Location</Text>
            </View>
          </View>
          <TouchableOpacity className="p-1">
            <Ionicons name="person-circle" size={40} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          className="flex-row bg-white p-4 rounded-xl mx-5 mt-5 items-center shadow-sm"
          onPress={() => setIsSearchVisible(true)}
        >
          <Ionicons name="search" size={20} color="#666" />
          <Text className="ml-3 text-gray-600 text-base">Where would you like to go?</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View className="flex-row justify-around p-3 mb-5">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-xl bg-blue-50 justify-center items-center mb-2">
              <Ionicons name="bus" size={24} color="#4A90E2" />
            </View>
            <Text className="text-xs font-medium text-gray-700">Book Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-xl bg-green-50 justify-center items-center mb-2">
              <Ionicons name="time" size={24} color="#43A047" />
            </View>
            <Text className="text-xs font-medium text-gray-700">History</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-xl bg-orange-50 justify-center items-center mb-2">
              <Ionicons name="star" size={24} color="#FF9800" />
            </View>
            <Text className="text-xs font-medium text-gray-700">Favorites</Text>
          </TouchableOpacity>

          {/* New Emergency Button */}
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-xl bg-red-50 justify-center items-center mb-2">
              <Ionicons name="warning" size={24} color="#DC2626" />
            </View>
            <Text className="text-xs font-medium text-gray-700">Emergency</Text>
          </TouchableOpacity>
        </View>

        {/* Map Section */}
        <View className="mx-5 rounded-xl overflow-hidden bg-white shadow-sm">
          <View className="flex-row justify-between items-center p-4">
            <Text className="text-lg font-bold text-indigo-900">Nearby Vehicles</Text>
            <TouchableOpacity onPress={() => setSeeAllVehicles(true)}>
              <Text className="text-sm font-medium text-blue-500">See All</Text>
            </TouchableOpacity>
          </View>
          <MapView
            className="h-48"
            initialRegion={{
              latitude: 14.5995,
              longitude: 120.9842,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {dummyVehicles.map((vehicle) => (
              <Marker
                key={vehicle.id}
                coordinate={{ latitude: 14.5995 + (Math.random() - 0.5) * 0.01, longitude: 120.9842 + (Math.random() - 0.5) * 0.01 }}
                title={`${vehicle.type} - ${vehicle.route}`}
              />
            ))}
          </MapView>
        </View>

        {/* Available Vehicles */}
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-indigo-900">Available Vehicles</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={20} color="#4A90E2" />
              <Text className="ml-2 text-blue-500">Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          {showFilters && (
            <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
              <Text className="font-bold mb-2">Filter Options:</Text>
              <TouchableOpacity
                className="flex-row items-center py-2"
                onPress={() => setSelectedFilters({ ...selectedFilters, accessibility: !selectedFilters.accessibility })}
              >
                <Ionicons
                  name={selectedFilters.accessibility ? "checkbox" : "square-outline"}
                  size={20}
                  color="#4A90E2"
                />
                <Text className="ml-2">Wheelchair Accessible</Text>
              </TouchableOpacity>
              {/* Add more filter options as needed */}
            </View>
          )}

          {/* Tabs */}
          <View className="flex-row bg-white rounded-xl p-1 mb-4">
            {['all', 'jeepney', 'bus', 'uv'].map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 py-2 px-3 rounded-lg ${activeTab === tab ? 'bg-blue-500' : ''}`}
                onPress={() => setActiveTab(tab)}
              >
                <Text className={`text-center text-sm font-medium ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vehicle Cards */}
          {dummyVehicles.map(vehicle => (
            <TouchableOpacity
              key={vehicle.id}
              className="flex-row bg-white rounded-xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="bus" size={24} color="#4A90E2" />
                  <Text className="text-base font-bold text-gray-800 ml-2">{vehicle.type}</Text>
                  {vehicle.accessibility && (
                    <View className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      <Ionicons name="accessibility" size={16} color="#4A90E2" />
                    </View>
                  )}
                </View>
                <Text className="text-sm text-gray-600 mb-1">{vehicle.route}</Text>
                <View className="flex-row justify-between items-center mr-3">
                  <Text className="text-sm text-gray-600">
                    <Ionicons name="time-outline" size={16} color="#666" /> {vehicle.eta}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    <Ionicons name="people-outline" size={16} color="#666" /> {vehicle.capacity}
                  </Text>
                  <Text className="text-base font-bold text-blue-500">{vehicle.fare}</Text>
                </View>
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-xs text-gray-500">Updated {vehicle.lastUpdated}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text className="text-xs text-gray-600 ml-1">{vehicle.driverRating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="bg-blue-500 px-5 py-2 rounded-lg justify-center">
                <Text className="text-white font-bold">Book</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        animationType="slide"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <View className="flex-1 bg-gray-50">
          <TouchableOpacity
            className="p-4"
            onPress={() => setIsSearchVisible(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <SearchScreen onSelectLocation={handleLocationSelect} />
        </View>
      </Modal>
    </>
  );
}