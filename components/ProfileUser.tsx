import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Improved profile schema with better validation
const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Must contain only digits'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
    location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type ProfileScreenProps = {
    onGoBack: () => void;
    // You can add more props as needed, like user data for initial values
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onGoBack }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form with React Hook Form
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: 'John Doe', // Sample default values, replace with actual user data
            email: 'john.doe@example.com',
            phone: '1234567890',
            username: 'johndoe',
            location: '',
        }
    });

    // Fetch location on component mount
    useEffect(() => {
        requestLocationPermission();

        // You would typically fetch user profile here and populate the form
        // This is a placeholder for that logic
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                // Fetch user data and set form values
                // const userData = await api.getUserProfile();
                // reset(userData);
            } catch (error) {
                Alert.alert('Error', 'Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Location permission is required to show your current location.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address && address[0]) {
                const locationString = [
                    address[0].street,
                    address[0].city,
                    address[0].region
                ].filter(Boolean).join(', ');

                setUserLocation(locationString);
                setValue('location', locationString);
            }
        } catch (error) {
            console.error('Location error:', error);
            Alert.alert('Error', 'Failed to get your current location');
        }
    };

    const pickImage = async () => {
        if (!isEditMode) return;

        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant camera roll permissions to upload your profile picture.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleCancel = () => {
        // Reset form to original values
        reset();
        setIsEditMode(false);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
            // Simulating API call
            console.log('Submitting form data:', data);
            console.log('Profile image:', profileImage);

            // Here you would typically update the profile via API
            // await api.updateProfile({ ...data, profileImage });

            setIsEditMode(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Implementation of actual logout logic would go here
        console.log('User logged out');
        setShowLogoutConfirm(false);
        // Navigate to login screen or perform other logout operations
    };

    const renderFormField = (
        name: keyof ProfileFormData,
        label: string,
        icon: keyof typeof Ionicons.glyphMap,
        placeholder: string,
        keyboardType: any = 'default',
        editable: boolean = true
    ) => (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-5">
                    <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
                    <View className={`flex-row items-center border ${errors[name] ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 px-4 py-3 rounded-xl ${!isEditMode || !editable ? 'opacity-80' : ''
                        }`}>
                        <Ionicons name={icon} size={20} color="#4A90E2" />
                        <TextInput
                            className="flex-1 ml-3 text-base text-gray-800"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            editable={isEditMode && editable}
                            keyboardType={keyboardType}
                            autoCapitalize={name === 'email' || name === 'username' ? 'none' : 'words'}
                            autoCorrect={false}
                        />
                    </View>
                    {errors[name] && (
                        <Text className="text-red-500 text-xs mt-1">{errors[name]?.message}</Text>
                    )}
                </View>
            )}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                    className="flex-1"
                >
                    {/* Header */}
                    <View className="bg-white py-4 flex-row justify-between items-center rounded-xl mb-6 px-4 mt-2 shadow-sm">
                        <TouchableOpacity onPress={onGoBack} className="p-2">
                            <Ionicons name="arrow-back" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-gray-900">My Profile</Text>
                        {isEditMode ? (
                            <View className="flex-row">
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    className="mr-3 px-3 py-2"
                                >
                                    <Text className="text-gray-600 font-medium">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit(onSubmit)}
                                    className="bg-blue-500 px-4 py-2 rounded-lg"
                                    disabled={isLoading || !isDirty}
                                >
                                    <Text className="text-white font-medium">
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setIsEditMode(true)}
                                className="bg-blue-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white font-medium">Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Profile Image */}
                    <View className="items-center mb-8">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="relative"
                            disabled={!isEditMode}
                        >
                            <View className="h-32 w-32 rounded-full bg-white shadow-md overflow-hidden border-2 border-gray-100">
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        className="h-32 w-32"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="h-32 w-32 bg-gray-100 items-center justify-center">
                                        <Ionicons name="person" size={60} color="#9CA3AF" />
                                    </View>
                                )}
                            </View>
                            {isEditMode && (
                                <View className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-2 border-white shadow-sm">
                                    <Ionicons name="camera" size={18} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                        {isEditMode && (
                            <Text className="text-blue-500 text-sm mt-2 font-medium">
                                Tap to change photo
                            </Text>
                        )}
                    </View>

                    {/* Form */}
                    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Personal Information</Text>
                        {renderFormField('fullName', 'Full Name', 'person', 'Enter your full name')}
                        {renderFormField('email', 'Email Address', 'mail', 'Enter your email', 'email-address')}
                        {renderFormField('phone', 'Phone Number', 'call', 'Enter your phone number', 'phone-pad')}
                        {renderFormField('username', 'Username', 'at', 'Enter your username')}
                        {renderFormField('location', 'Current Location', 'location', userLocation || 'Detecting location...', 'default', false)}
                    </View>

                    {/* Account Actions */}
                    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Account</Text>

                        <TouchableOpacity
                            className="flex-row items-center py-3 border-b border-gray-100"
                            onPress={() => Alert.alert('Info', 'Change password functionality would go here')}
                        >
                            <Ionicons name="key-outline" size={20} color="#4A90E2" />
                            <Text className="ml-3 text-gray-800 font-medium">Change Password</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center py-3 border-b border-gray-100"
                            onPress={() => Alert.alert('Info', 'Privacy settings would go here')}
                        >
                            <Ionicons name="shield-outline" size={20} color="#4A90E2" />
                            <Text className="ml-3 text-gray-800 font-medium">Privacy Settings</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center py-3"
                            onPress={() => setShowLogoutConfirm(true)}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#FF4444" />
                            <Text className="ml-3 text-red-600 font-medium">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Logout Confirmation Modal */}
            <Modal visible={showLogoutConfirm} transparent animationType="fade">
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="bg-white p-6 rounded-2xl w-4/5 max-w-sm m-4 shadow-lg">
                        <View className="items-center mb-5">
                            <View className="bg-red-100 p-4 rounded-full mb-4">
                                <Ionicons name="log-out" size={28} color="#FF4444" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-3">Logout</Text>
                            <Text className="text-gray-600 text-center">
                                Are you sure you want to logout from your account?
                            </Text>
                        </View>
                        <View className="flex-row space-x-4 mt-2">
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 p-3 rounded-xl"
                                onPress={() => setShowLogoutConfirm(false)}
                            >
                                <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-red-500 p-3 rounded-xl"
                                onPress={handleLogout}
                            >
                                <Text className="text-white text-center font-medium">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfileScreen;