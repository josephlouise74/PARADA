// app/index.tsx

import ProfileScreen from '@/components/ProfileUser';
import { Trip, Vehicle } from '@/types/puv-types';
import { categories, dummyTrips, dummyVehicles, INITIAL_REGION } from '@/utils/static-data/vehicles-data';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);
  const [searchQuery, setSearchQuery] = useState('');


  const [isProfileUser, setIsProfileUser] = useState(false)

  const router = useRouter();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show nearby vehicles.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const handleBooking = (trip: Trip) => {
    Alert.alert(
      'Confirm Booking',
      `Would you like to book a ticket for ${trip.name}?\nPrice: ${trip.price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: () => {
            Alert.alert('Success', 'Ticket booked successfully!');
          },
        },
      ]
    );
  };

  const filteredTrips = dummyTrips.filter(
    trip => (activeCategory === 'all' || trip.type === activeCategory) &&
      (searchQuery === '' || trip.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  if (isProfileUser) {
    return <ProfileScreen onGoBack={() => setIsProfileUser(false)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header with Search */}
      <View className="bg-white shadow-sm">
        <View className="px-4 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">PUV Tickets</Text>
            <Text className="text-sm text-gray-600">Book your ride easily</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity /* onPress={() => router.push('/notifications')} */>
              <Ionicons name="notifications-outline" size={24} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsProfileUser(true)} >
              <Ionicons name="person-circle" size={28} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3">
          <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-900"
              placeholder="Where are you going?"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity /* onPress={() => router.push('/search')} */>
              <Ionicons name="options-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2 py-2"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              className={`mx-2 px-4 py-2 rounded-full flex-row items-center ${activeCategory === category.id ? 'bg-blue-500' : 'bg-gray-100'
                }`}
            >
              <Ionicons
                name={category.icon}
                size={16}
                color={activeCategory === category.id ? '#FFF' : '#666'}
              />
              <Text className={`ml-2 font-medium ${activeCategory === category.id ? 'text-white' : 'text-gray-700'
                }`}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 mb-[13%]">
        {/* Map Section */}
        <View className="mt-6 mx-4">

          <View className='bg-white rounded-2xl shadow-md overflow-hidden'>
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-semibold text-gray-900">Nearby Vehicles</Text>
                  <Text className="text-sm text-gray-500 mt-1">Find available PUVs around you</Text>
                </View>
                <TouchableOpacity
                  className="px-3 py-2 bg-blue-50 rounded-lg"
                /*   onPress={() => setSeeAllVehicles(true)} */
                >
                  <Text className="text-sm font-medium text-blue-600">See All</Text>
                </TouchableOpacity>
              </View>
            </View>


            <View style={{ width: '100%', height: 300, borderRadius: 10, overflow: 'hidden' }}>
              <MapView
                style={{ flex: 1 }}
                region={mapRegion} // Ensure this is dynamic
                showsUserLocation
                showsMyLocationButton
              >
                {dummyVehicles.map((vehicle) => (
                  <Marker
                    key={vehicle.id}
                    coordinate={{
                      latitude: vehicle.latitude || 14.5995 + (Math.random() - 0.5) * 0.01,
                      longitude: vehicle.longitude || 120.9842 + (Math.random() - 0.5) * 0.01,
                    }}
                    title={`${vehicle.type} - ${vehicle.route}`}
                  />
                ))}
              </MapView>
            </View>
          </View>
        </View>


        {/* Available Trips Section */}
        {/* Available Trips Section */}
        <View className="mt-6 mx-4">
          {/* Section Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-xl font-bold text-gray-900">Available Trips</Text>
              <Text className="text-sm text-gray-500">Find your next ride</Text>
            </View>
            <TouchableOpacity
              className="px-3 py-2 bg-blue-50 rounded-lg"
            /*   onPress={() => router.push('/all-trips')} */
            >
              <Text className="text-sm font-medium text-blue-600">See All</Text>
            </TouchableOpacity>
          </View>

          {/* Trips List */}
          {filteredTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm"
              onPress={() => handleBooking(trip)}
            >
              {/* Header with Vehicle Info */}
              <View className="flex-row items-center mb-3">
                <View className="bg-blue-100 p-2 rounded-full">
                  <Ionicons
                    name={trip.type === 'bus' ? 'bus' : 'car'}
                    size={20}
                    color="#1D4ED8"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-lg font-bold text-gray-900">{trip.name}</Text>
                  <Text className="text-sm text-gray-500">Vehicle ID: {trip.vehicleId}</Text>
                  <Text className="text-sm text-gray-500">Type: <Text className="text-green-600">{trip.type}</Text></Text>
                </View>
                <View className="items-end">
                  <Text className="text-xl font-bold text-blue-600">{trip.price}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="person" size={14} color="#059669" />
                    <Text className="text-green-600 ml-1 font-medium">
                      {trip.seatsAvailable} seats left
                    </Text>
                  </View>
                </View>
              </View>

              {/* Route and Time Info */}
              <View className="bg-gray-50 p-3 rounded-xl mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="time-outline" size={18} color="#4B5563" />
                    <View className="ml-2">
                      <Text className="text-sm font-medium text-gray-700">Departure</Text>
                      <Text className="text-base text-gray-900">{trip.departure}</Text>
                    </View>
                  </View>
                  <View className="w-8 h-[1px] bg-gray-300" />
                  <View className="flex-row items-center flex-1 justify-end">
                    <View className="mr-2 items-end">
                      <Text className="text-sm font-medium text-gray-700">Arrival</Text>
                      <Text className="text-base text-gray-900">{trip.arrival}</Text>
                    </View>
                    <Ionicons name="flag-outline" size={18} color="#4B5563" />
                  </View>
                </View>
              </View>

              {/* Stops Information */}
              <View className="bg-gray-50 p-3 rounded-xl">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="map-outline" size={18} color="#4B5563" />
                  <Text className="ml-2 font-medium text-gray-700">
                    Route Stops ({trip.stops.length})
                  </Text>
                </View>
                <View className="ml-5">
                  {trip.stops.map((stop, index) => (
                    <View key={stop} className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                      <Text className="text-gray-600">{stop}</Text>
                      {index !== trip.stops.length - 1 && (
                        <View className="w-[1px] h-4 bg-gray-300 absolute left-1 top-4" />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Book Now Button */}
              <TouchableOpacity
                className="mt-4 bg-blue-600 py-3 rounded-xl"
                onPress={() => handleBooking(trip)}
              >
                <Text className="text-white text-center font-semibold">
                  Book Now
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}