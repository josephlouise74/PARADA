import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';

// Form schema
const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    homeAddress: z.string().min(5, 'Address must be at least 5 characters'),
    workAddress: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileScreenProps {
    onGoBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onGoBack }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = async (data: ProfileFormData) => {
        try {
            console.log('Form data:', data);
            setIsEditMode(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Please allow access to your photo library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const renderFormField = (name: keyof ProfileFormData, label: string, icon: keyof typeof Ionicons.glyphMap, placeholder: string) => (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{label}</Text>
                    <View style={[styles.inputWrapper, errors[name] && styles.inputError]}>
                        <Ionicons name={icon} size={20} color="#4A90E2" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            placeholder={placeholder}
                            editable={isEditMode}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors[name] && <Text style={styles.errorText}>{errors[name]?.message}</Text>}
                </View>
            )}
        />
    );

    const renderQuickActionButton = (icon: keyof typeof Ionicons.glyphMap, label: string, color: string, bgColor: string, onPress: () => void) => (
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <View style={[styles.actionIcon, { backgroundColor: bgColor }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
                        <Ionicons name="arrow-back-outline" size={28} color="#4A90E2" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity onPress={() => isEditMode ? handleSubmit(onSubmit)() : setIsEditMode(true)} style={styles.editButton}>
                        <Text style={styles.editButtonText}>{isEditMode ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Image */}
                <View style={styles.profileImageSection}>
                    <TouchableOpacity onPress={handleImagePick} disabled={!isEditMode} style={styles.imageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Ionicons name="person" size={60} color="#4A90E2" />
                            </View>
                        )}
                        {isEditMode && (
                            <View style={styles.editImageButton}>
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {renderFormField("fullName", "Full Name", "person-outline", "Enter your full name")}
                    {renderFormField("email", "Email", "mail-outline", "Enter your email")}
                    {renderFormField("phone", "Phone", "call-outline", "Enter your phone number")}
                    {renderFormField("homeAddress", "Home Address", "home-outline", "Enter your home address")}
                    {renderFormField("workAddress", "Work Address", "business-outline", "Enter your work address")}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    {renderQuickActionButton("notifications-outline", "Notifications", "#4A90E2", "#E3F2FD", () => { })}
                    {renderQuickActionButton("shield-checkmark-outline", "Privacy", "#43A047", "#E8F5E9", () => { })}
                    {renderQuickActionButton("settings-outline", "Settings", "#FF9800", "#FFF3E0", () => { })}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutConfirm(true)}>
                    <Ionicons name="log-out-outline" size={24} color="#FF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Logout Modal */}
            <Modal visible={showLogoutConfirm} transparent={true} animationType="fade" statusBarTranslucent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Logout Confirmation</Text>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowLogoutConfirm(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={() => {
                                setShowLogoutConfirm(false);
                                // Handle logout
                            }}>
                                <Text style={styles.confirmButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    // Styles
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A237E',
    },
    editButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    profileImageSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4A90E2',
        padding: 8,
        borderRadius: 20,
    },
    formContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
    },
    inputError: {
        borderColor: '#FF4444',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: '#FF4444',
        fontSize: 12,
        marginTop: 4,
    },
    quickActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    actionButton: {
        alignItems: "center",
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: "#333",
        fontSize: 12,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFE5E5',
        margin: 20,
        padding: 15,
        borderRadius: 12,
    },
    logoutText: {
        color: '#FF4444',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    bottomSpacing: {
        height: 80,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A237E',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    confirmButton: {
        backgroundColor: '#FF4444',
    },
    cancelButtonText: {
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
    },
});
