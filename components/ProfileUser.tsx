import React, { useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Validation schema using zod
const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .regex(/^\d+$/, 'Must contain only digits'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
    location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type ProfileScreenProps = {
    onGoBack: () => void;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onGoBack }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            username: 'johndoe',
            location: '',
        },
    });

    useEffect(() => {
        requestLocationPermission();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            // Simulate fetching user data
            // const userData = await api.getUserProfile();
            // reset(userData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

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
                const locationString = [address[0].street, address[0].city, address[0].region]
                    .filter(Boolean)
                    .join(', ');
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

    const handleCancelEdit = () => {
        reset();
        setIsEditMode(false);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
            console.log('Submitting form data:', data);
            console.log('Profile image:', profileImage);
            // Simulate API update call
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
        console.log('User logged out');
        setShowLogoutConfirm(false);
        // Perform actual logout logic here
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-800">
            <View className="flex-1 bg-gray-100">
                <StatusBar barStyle="light-content" backgroundColor="#ffffff" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1"
                >
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} className="flex-1">
                        <View className="mb-4">
                            <Header
                                onGoBack={onGoBack}
                                isEditMode={isEditMode}
                                onEdit={() => setIsEditMode(true)}
                                onCancel={handleCancelEdit}
                                onSave={handleSubmit(onSubmit)}
                                isLoading={isLoading}
                                isDirty={isDirty}
                            />
                        </View>
                        <View className="mb-4">
                            <ProfileImage
                                imageUri={profileImage}
                                onPickImage={pickImage}
                                isEditMode={isEditMode}
                            />
                        </View>
                        <View className="mb-4">
                            <PersonalInfoForm
                                control={control}
                                errors={errors}
                                userLocation={userLocation}
                                isEditMode={isEditMode}
                            />
                        </View>
                        <View className="mb-4">
                            <AccountActions onLogout={() => setShowLogoutConfirm(true)} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <LogoutModal
                    visible={showLogoutConfirm}
                    onCancel={() => setShowLogoutConfirm(false)}
                    onLogout={handleLogout}
                />
            </View>
        </SafeAreaView>

    );
};

type HeaderProps = {
    onGoBack: () => void;
    isEditMode: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    isLoading: boolean;
    isDirty: boolean;
};

const Header = ({
    onGoBack,
    isEditMode,
    onEdit,
    onCancel,
    onSave,
    isLoading,
    isDirty,
}: HeaderProps) => {
    return (
        <View className="flex-row items-center justify-between bg-white px-4 py-3 rounded-lg mb-6">
            <TouchableOpacity onPress={onGoBack} className="p-2">
                <Ionicons name="arrow-back" size={26} color="#1E40AF" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-800 flex-1 text-center">
                Profile Settings
            </Text>
            {isEditMode ? (
                <View className="flex-row space-x-3">
                    <TouchableOpacity onPress={onCancel} className="px-3 py-2">
                        <Text className="text-gray-600 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSave}
                        disabled={isLoading || !isDirty}
                        className={`px-4 py-2 rounded-lg ${isLoading || !isDirty ? 'bg-gray-400' : 'bg-blue-600'
                            }`}
                    >
                        <Text className="text-white font-medium">
                            {isLoading ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={onEdit} className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium">Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

type ProfileImageProps = {
    imageUri: string | null;
    onPickImage: () => void;
    isEditMode: boolean;
};

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUri, onPickImage, isEditMode }) => {
    return (
        <View className="items-center mb-8">
            <TouchableOpacity onPress={onPickImage} disabled={!isEditMode} className="relative">
                <View className="h-32 w-32 rounded-full bg-white overflow-hidden border-4 border-blue-600 ">
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="h-32 w-32" resizeMode="cover" />
                    ) : (
                        <View className="h-32 w-32 bg-gray-200 items-center justify-center">
                            <Ionicons name="person" size={60} color="#6B7280" />
                        </View>
                    )}
                </View>
                {isEditMode && (
                    <View className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white ">
                        <Ionicons name="camera" size={18} color="white" />
                    </View>
                )}
            </TouchableOpacity>
            {isEditMode && (
                <Text className="text-blue-600 text-sm mt-2 font-medium">Change Photo</Text>
            )}
        </View>
    );
};

type PersonalInfoFormProps = {
    control: any;
    errors: any;
    userLocation: string;
    isEditMode: boolean;
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    control,
    errors,
    userLocation,
    isEditMode,
}) => {
    const FormField = ({
        name,
        label,
        icon,
        placeholder,
        keyboardType = 'default',
        editable = true,
    }: {
        name: keyof ProfileFormData;
        label: string;
        icon: keyof typeof Ionicons.glyphMap;
        placeholder: string;
        keyboardType?: any;
        editable?: boolean;
    }) => (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-5">
                    <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
                    <View
                        className={`flex-row items-center border ${errors[name] ? 'border-red-500' : 'border-gray-300'
                            } bg-gray-50 px-4 py-3 rounded-lg ${!isEditMode || !editable ? 'opacity-70' : ''
                            }`}
                    >
                        <Ionicons name={icon} size={22} color="#2563EB" />
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
        <View className="bg-white p-6 rounded-lg  mb-6 ">
            <Text className="text-lg font-bold text-gray-800 mb-4">Personal Information</Text>
            <FormField name="fullName" label="Full Name" icon="person" placeholder="Enter your full name" />
            <FormField
                name="email"
                label="Email Address"
                icon="mail"
                placeholder="Enter your email"
                keyboardType="email-address"
            />
            <FormField
                name="phone"
                label="Phone Number"
                icon="call"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
            />
            <FormField name="username" label="Username" icon="at" placeholder="Enter your username" />
            <FormField
                name="location"
                label="Current Location"
                icon="location"
                placeholder={userLocation || 'Detecting location...'}
                editable={false}
            />
        </View>
    );
};

type AccountActionsProps = {
    onLogout: () => void;
};

const AccountActions: React.FC<AccountActionsProps> = ({ onLogout }) => (
    <View className="bg-white p-6 rounded-lg  mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Account</Text>
        <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-200"
            onPress={() => Alert.alert('Info', 'Change password functionality would go here')}
        >
            <Ionicons name="key-outline" size={22} color="#2563EB" />
            <Text className="ml-4 text-gray-800 font-medium flex-1">Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-200"
            onPress={() => Alert.alert('Info', 'Privacy settings would go here')}
        >
            <Ionicons name="shield-outline" size={22} color="#2563EB" />
            <Text className="ml-4 text-gray-800 font-medium flex-1">Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-3" onPress={onLogout}>
            <Ionicons name="log-out-outline" size={22} color="#DC2626" />
            <Text className="ml-4 text-red-600 font-medium">Logout</Text>
        </TouchableOpacity>
    </View>
);

type LogoutModalProps = {
    visible: boolean;
    onCancel: () => void;
    onLogout: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onCancel, onLogout }) => (
    <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-10">
            <View className="bg-white p-6 rounded-xl w-11/12 max-w-sm ">
                <View className="items-center mb-5">
                    <View className="bg-red-100 p-4 rounded-full mb-4">
                        <Ionicons name="log-out" size={28} color="#DC2626" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 mb-3">Logout</Text>
                    <Text className="text-gray-600 text-center">
                        Are you sure you want to logout from your account?
                    </Text>
                </View>
                <View className="flex-row space-x-4 mt-4">
                    <TouchableOpacity onPress={onCancel} className="flex-1 bg-gray-200 p-3 rounded-xl">
                        <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onLogout} className="flex-1 bg-red-500 p-3 rounded-xl">
                        <Text className="text-white text-center font-medium">Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

export default ProfileScreen;
