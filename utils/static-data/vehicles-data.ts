/* export interface Vehicle {
    id: number;
    type: string;
    route: string;
    location: string;
    latitude: number;
    longitude: number;
    eta: string;
    fare: string;
}

export const dummyVehicles: Vehicle[] = [
    {
        id: 1,
        type: "Jeepney",
        route: "Novaliches Bayan - Blumentritt",
        location: "Novaliches Bayan",
        latitude: 14.7319,
        longitude: 121.0443,
        eta: "10 mins",
        fare: "₱20"
    },
    {
        id: 2,
        type: "Jeepney",
        route: "Novaliches - Camarin Extended Bagong Silang",
        location: "Novaliches Bayan",
        latitude: 14.7579,
        longitude: 121.0412,
        eta: "15 mins",
        fare: "₱13"
    },
    {
        id: 3,
        type: "Jeepney",
        route: "Novaliches - Cubao",
        location: "Novaliches Bayan",
        latitude: 14.7098,
        longitude: 121.0526,
        eta: "20 mins",
        fare: "₱25"
    },
    {
        id: 4,
        type: "UV",
        route: "Novaliches - Makati (Ayala)",
        location: "Novaliches Bayan",
        latitude: 14.7005,
        longitude: 121.0614,
        eta: "35 mins",
        fare: "₱60"
    },
    {
        id: 5,
        type: "UV",
        route: "Novaliches - Ortigas",
        location: "Novaliches Bayan",
        latitude: 14.7062,
        longitude: 121.0418,
        eta: "30 mins",
        fare: "₱55"
    },
    {
        id: 6,
        type: "Bus",
        route: "Fairview - Lawton",
        location: "Fairview",
        latitude: 14.6929,
        longitude: 121.0833,
        eta: "40 mins",
        fare: "₱50"
    },
    {
        id: 7,
        type: "Bus",
        route: "SM Fairview - Ayala",
        location: "Fairview",
        latitude: 14.7316,
        longitude: 121.0617,
        eta: "45 mins",
        fare: "₱60"
    },
    {
        id: 8,
        type: "Taxi",
        route: "Novaliches - NAIA Airport",
        location: "Novaliches Bayan",
        latitude: 14.5184,
        longitude: 121.0192,
        eta: "50 mins",
        fare: "₱350+"
    },
    {
        id: 9,
        type: "Taxi",
        route: "Novaliches - BGC",
        location: "Novaliches Bayan",
        latitude: 14.5547,
        longitude: 121.0450,
        eta: "35 mins",
        fare: "₱300+"
    },
    {
        id: 10,
        type: "Tricycle",
        route: "Novaliches Bayan - Deparo",
        location: "Novaliches Bayan",
        latitude: 14.7430,
        longitude: 121.0370,
        eta: "10 mins",
        fare: "₱30"
    },
    {
        id: 11,
        type: "Jeepney",
        route: "Caloocan - Monumento",
        location: "Caloocan",
        latitude: 14.6573,
        longitude: 120.9845,
        eta: "5 mins",
        fare: "₱15"
    },
    {
        id: 12,
        type: "Jeepney",
        route: "Caloocan - Malabon",
        location: "Caloocan",
        latitude: 14.6605,
        longitude: 120.9672,
        eta: "7 mins",
        fare: "₱20"
    },
    {
        id: 13,
        type: "Jeepney",
        route: "SM North - Cubao",
        location: "SM North",
        latitude: 14.7060,
        longitude: 121.0337,
        eta: "10 mins",
        fare: "₱20"
    },
    {
        id: 14,
        type: "UV",
        route: "SM North - Ortigas",
        location: "SM North",
        latitude: 14.7035,
        longitude: 121.0485,
        eta: "15 mins",
        fare: "₱45"
    },
    {
        id: 15,
        type: "UV",
        route: "Caloocan - Makati (Ayala)",
        location: "Caloocan",
        latitude: 14.6568,
        longitude: 120.9815,
        eta: "30 mins",
        fare: "₱70"
    },
    {
        id: 16,
        type: "Bus",
        route: "SM North - Baclaran",
        location: "SM North",
        latitude: 14.7038,
        longitude: 121.0452,
        eta: "45 mins",
        fare: "₱55"
    },
    {
        id: 17,
        type: "Bus",
        route: "Caloocan - Alabang",
        location: "Caloocan",
        latitude: 14.6569,
        longitude: 120.9847,
        eta: "50 mins",
        fare: "₱65"
    },
    {
        id: 18,
        type: "Taxi",
        route: "SM North - NAIA Airport",
        location: "SM North",
        latitude: 14.6971,
        longitude: 121.0398,
        eta: "40 mins",
        fare: "₱400+"
    },
    {
        id: 19,
        type: "Taxi",
        route: "Caloocan - Pasig",
        location: "Caloocan",
        latitude: 14.6571,
        longitude: 120.9822,
        eta: "35 mins",
        fare: "₱350+"
    },
    {
        id: 20,
        type: "Tricycle",
        route: "Caloocan - Sangandaan",
        location: "Caloocan",
        latitude: 14.6550,
        longitude: 120.9743,
        eta: "8 mins",
        fare: "₱25"
    },
    // QUEZON CITY
    {
        id: 21,
        type: "Jeepney",
        route: "Quezon Ave - Welcome Rotonda",
        location: "Quezon City",
        latitude: 14.6466,
        longitude: 121.0374,
        eta: "6 mins",
        fare: "₱17"
    },
    {
        id: 22,
        type: "Jeepney",
        route: "Cubao - Anonas",
        location: "Quezon City",
        latitude: 14.6201,
        longitude: 121.0533,
        eta: "8 mins",
        fare: "₱15"
    },
    {
        id: 23,
        type: "Bus",
        route: "Quezon Ave - Makati",
        location: "Quezon City",
        latitude: 14.6465,
        longitude: 121.0499,
        eta: "20 mins",
        fare: "₱50"
    },
    {
        id: 24,
        type: "UV",
        route: "Commonwealth - Ortigas",
        location: "Quezon City",
        latitude: 14.6775,
        longitude: 121.0583,
        eta: "30 mins",
        fare: "₱45"
    },
    {
        id: 25,
        type: "Taxi",
        route: "Eastwood - MOA",
        location: "Quezon City",
        latitude: 14.6091,
        longitude: 121.0791,
        eta: "35 mins",
        fare: "₱400+"
    },

    // MAKATI
    {
        id: 26,
        type: "Jeepney",
        route: "Buendia - Ayala",
        location: "Makati",
        latitude: 14.5586,
        longitude: 121.0178,
        eta: "5 mins",
        fare: "₱14"
    },
    {
        id: 27,
        type: "Bus",
        route: "Makati - BGC",
        location: "Makati",
        latitude: 14.5518,
        longitude: 121.0233,
        eta: "10 mins",
        fare: "₱30"
    },
    {
        id: 28,
        type: "UV",
        route: "Makati - Fairview",
        location: "Makati",
        latitude: 14.5531,
        longitude: 121.0197,
        eta: "45 mins",
        fare: "₱60"
    },
    {
        id: 29,
        type: "Taxi",
        route: "Glorietta - Divisoria",
        location: "Makati",
        latitude: 14.5513,
        longitude: 121.0260,
        eta: "40 mins",
        fare: "₱500+"
    },

    // MANILA
    {
        id: 30,
        type: "Jeepney",
        route: "España - Quiapo",
        location: "Manila",
        latitude: 14.6042,
        longitude: 120.9882,
        eta: "5 mins",
        fare: "₱13"
    },
    {
        id: 31,
        type: "Jeepney",
        route: "Divisoria - Lawton",
        location: "Manila",
        latitude: 14.5995,
        longitude: 120.9834,
        eta: "6 mins",
        fare: "₱12"
    },
    {
        id: 32,
        type: "Bus",
        route: "Manila - Pasay",
        location: "Manila",
        latitude: 14.5832,
        longitude: 120.9783,
        eta: "20 mins",
        fare: "₱40"
    },
    {
        id: 33,
        type: "Taxi",
        route: "Intramuros - NAIA",
        location: "Manila",
        latitude: 14.5909,
        longitude: 120.9751,
        eta: "30 mins",
        fare: "₱350+"
    },

    // PASAY
    {
        id: 34,
        type: "Jeepney",
        route: "Pasay Rotonda - Baclaran",
        location: "Pasay",
        latitude: 14.5329,
        longitude: 120.9922,
        eta: "5 mins",
        fare: "₱10"
    },
    {
        id: 35,
        type: "Bus",
        route: "Pasay - Alabang",
        location: "Pasay",
        latitude: 14.5377,
        longitude: 121.0013,
        eta: "40 mins",
        fare: "₱55"
    },
    {
        id: 36,
        type: "UV",
        route: "Pasay - Cubao",
        location: "Pasay",
        latitude: 14.5410,
        longitude: 121.0032,
        eta: "35 mins",
        fare: "₱50"
    },
    {
        id: 37,
        type: "Taxi",
        route: "MOA - Quezon City",
        location: "Pasay",
        latitude: 14.5353,
        longitude: 120.9804,
        eta: "50 mins",
        fare: "₱450+"
    }
];
 */

import { Category, Trip, Vehicle } from "@/types/puv-types";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const INITIAL_REGION = {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02 * (width / height),
};

export const categories: Category[] = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'bus', label: 'Bus', icon: 'bus' },
    { id: 'jeepney', label: 'Jeepney', icon: 'car' },
    { id: 'van', label: 'Van', icon: 'car-sport' },
];

export const dummyTrips: Trip[] = [
    {
        id: 1,
        type: 'bus',
        name: 'Route 1: Manila - Quezon City',
        departure: '6:00 AM',
        arrival: '7:30 AM',
        price: '₱50',
        seatsAvailable: 10,
        route: 'Manila to Quezon City',
        vehicleId: 'BUS-001',
        stops: ['Manila Central', 'Quiapo', 'Cubao', 'North EDSA'],
    },
    {
        id: 2,
        type: 'jeepney',
        name: 'Route 2: Makati - Pasay',
        departure: '7:00 AM',
        arrival: '7:45 AM',
        price: '₱20',
        seatsAvailable: 5,
        route: 'Makati to Pasay',
        vehicleId: 'JEP-001',
        stops: ['Ayala', 'Gil Puyat', 'Taft Avenue', 'Mall of Asia'],
    },
];

export const dummyVehicles: Vehicle[] = [
    {
        id: 1,
        type: 'Bus',
        route: 'Manila - QC',
        latitude: 14.6091,
        longitude: 121.0223,
        currentPassengers: 15,
        maxCapacity: 50,
        nextStop: 'Cubao',
        estimatedArrival: '5 mins',
    },
    {
        id: 2,
        type: 'Jeepney',
        route: 'Makati - Pasay',
        latitude: 14.5547,
        longitude: 121.0244,
        currentPassengers: 8,
        maxCapacity: 16,
        nextStop: 'Ayala',
        estimatedArrival: '3 mins',
    },
];