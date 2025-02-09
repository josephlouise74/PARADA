// types/index.ts

export interface Category {
    id: string;
    label: string;
    icon: any;
}

export interface Trip {
    id: number;
    type: 'bus' | 'jeepney' | 'van';
    name: string;
    departure: string;
    arrival: string;
    price: string;
    seatsAvailable: number;
    route: string;
    vehicleId: string;
    stops: string[];
}

export interface Vehicle {
    id: number;
    type: 'Bus' | 'Jeepney' | 'Van';
    route: string;
    latitude: number;
    longitude: number;
    currentPassengers: number;
    maxCapacity: number;
    nextStop: string;
    estimatedArrival: string;
}

export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}