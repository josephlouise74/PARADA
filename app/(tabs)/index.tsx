// app/index.tsx

import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Define initial region in Manila, Philippines
const INITIAL_REGION: Region = {
  latitude: 14.5995,
  longitude: 120.9842,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface Vehicle {
  id: string;
  type: string;
  route: string;
  latitude: number;
  longitude: number;
}

interface Trip {
  id: string;
  name: string;
  vehicleId: string;
  seatsAvailable: number;
  price: string;
  departure: string;
  arrival: string;
  stops: string[];
  type: string;
}

// Dummy data for EJeep vehicles and trips
const dummyEjeepVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'EJeep',
    route: 'Jeepney Route 1',
    latitude: 14.6020,
    longitude: 120.9850,
  },
];

const dummyEjeepTrips: Trip[] = [
  {
    id: 't1',
    name: 'Manila to Makati',
    vehicleId: '1',
    seatsAvailable: 10,
    price: 'PHP 20',
    departure: '08:00 AM',
    arrival: '08:30 AM',
    stops: ['Manila', 'Ermita', 'Makati'],
    type: 'EJeep',
  },
  {
    id: 't2',
    name: 'Manila to Quezon City',
    vehicleId: '1',
    seatsAvailable: 8,
    price: 'PHP 25',
    departure: '09:00 AM',
    arrival: '09:45 AM',
    stops: ['Manila', 'Cubao', 'Quezon City'],
    type: 'EJeep',
  },
];

const HomeScreen = () => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show nearby rides.');
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
      Alert.alert('Error', 'Failed to get location.');
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
          onPress: () => Alert.alert('Success', 'Ticket booked successfully!'),
        },
      ]
    );
  };

  // Filter trips based on search query
  const filteredTrips = dummyEjeepTrips.filter(
    trip => searchQuery.trim() === '' || trip.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle to display a Profile Screen (placeholder for now)
  if (isProfileVisible) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl">Profile Screen Placeholder</Text>
        <TouchableOpacity
          onPress={() => setIsProfileVisible(false)}
          className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className='flex-1 bg-slate-100'>
        <StatusBar style="light" backgroundColor="#1D4ED8" />
        <View className="flex-1">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onProfilePress={() => setIsProfileVisible(true)}
          />
          <ScrollView className="flex-1 mb-16">
            <MapSection mapRegion={mapRegion} vehicles={dummyEjeepVehicles} />
            <TripList trips={filteredTrips} onBook={handleBooking} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProfilePress: () => void;
}

const Header = ({ searchQuery, setSearchQuery, onProfilePress }: HeaderProps) => {
  return (
    <View className="bg-white shadow p-4">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-800">EJeep Tickets</Text>
          <Text className="text-sm text-gray-500">Book your ride in Manila</Text>
        </View>
        <View className="flex-row items-center space-x- gap-5">
          <TouchableOpacity className="relative">
            <Ionicons name="notifications-outline" size={24} color="#4A90E2" />
            {/* Notification badge */}
            <View className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress}>
            <Ionicons name="person-circle" size={28} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-4">
        <View className="flex-row items-center bg-gray-100 p-3 rounded-full">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Where are you going?"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    </View>
  );
};

interface MapSectionProps {
  mapRegion: Region;
  vehicles: Vehicle[];
}

const MapSection = ({ mapRegion, vehicles }: MapSectionProps) => {
  return (
    <View className="m-4 bg-white rounded-2xl shadow overflow-hidden">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">Nearby EJeep Vehicles</Text>
        <Text className="text-sm text-gray-500 mt-1">Find available rides around you</Text>
      </View>
      <View style={{ width: '100%', height: 300 }}>
        <MapView style={{ flex: 1 }} region={mapRegion} showsUserLocation showsMyLocationButton>
          {vehicles.map(vehicle => (
            <Marker
              key={vehicle.id}
              coordinate={{ latitude: vehicle.latitude, longitude: vehicle.longitude }}
              title={`${vehicle.type} - ${vehicle.route}`}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

interface TripListProps {
  trips: Trip[];
  onBook: (trip: Trip) => void;
}

const TripList = ({ trips, onBook }: TripListProps) => {
  return (
    <View className="m-4">

      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-gray-800">Available EJeep Trips</Text>
          <Text className="text-sm text-gray-500">Find your next ride</Text>
        </View>
        <TouchableOpacity className="bg-blue-50 px-4 py-2 rounded-lg">
          <Text className="text-blue-600 font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      {trips.map(trip => (
        <TouchableOpacity
          key={trip.id}
          className="bg-white p-4 rounded-2xl mb-4 shadow"
          onPress={() => onBook(trip)}
        >
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-100 p-3 rounded-full">
              <Ionicons name="car" size={20} color="#1D4ED8" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-800">{trip.name}</Text>
              <Text className="text-sm text-gray-500">Vehicle ID: {trip.vehicleId}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xl font-bold text-blue-600">{trip.price}</Text>
              <Text className="text-green-600 text-sm mt-1">{trip.seatsAvailable} seats left</Text>
            </View>
          </View>
          <View className="bg-gray-50 p-3 rounded-xl mb-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#4B5563" />
                <View className="ml-2">
                  <Text className="text-sm font-medium text-gray-700">Departure</Text>
                  <Text className="text-base text-gray-900">{trip.departure}</Text>
                </View>
              </View>
              <View className="w-8 h-[1px] bg-gray-300" />
              <View className="flex-row items-center">
                <View className="mr-2">
                  <Text className="text-sm font-medium text-gray-700">Arrival</Text>
                  <Text className="text-base text-gray-900">{trip.arrival}</Text>
                </View>
                <Ionicons name="flag-outline" size={18} color="#4B5563" />
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="mt-4 bg-blue-600 py-3 rounded-xl"
            onPress={() => onBook(trip)}
          >
            <Text className="text-white text-center font-semibold">Book Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HomeScreen;