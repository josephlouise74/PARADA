import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar, Platform } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SubscriptionUI = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const features = {
        basic: [
            "Book regular eJeep rides",
            "View estimated arrival times",
            "Basic route planning"
        ],
        premium: [
            "Priority booking during peak hours",
            "Real-time driver location tracking",
            "Route optimization",
            "24/7 customer support",
            "Offline route maps"
        ],
        business: [
            "All Premium features",
            "Corporate billing",
            "Multiple seat reservations",
            "Schedule recurring rides",
            "Dedicated support hotline",
            "Custom route planning"
        ]
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#f8fafc",
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Header Section */}
                <LinearGradient
                    colors={["#1e40af", "#3b82f6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="px-6 pt-8 pb-10 rounded-b-3xl mb-6"
                >
                    <View className="items-center mb-6">
                        <View className="bg-white/20 p-4 rounded-full">
                            <FontAwesome5 name="bus-alt" size={32} color="#ffffff" />
                        </View>
                    </View>
                    <Text className="text-3xl font-bold text-white text-center mb-3">
                        PUV eJeep Premium
                    </Text>
                    <Text className="text-center text-white text-base opacity-90 mb-5 px-4">
                        Upgrade your daily commute experience with priority access and exclusive features
                    </Text>

                    <View className="flex-row justify-center">
                        <View className="bg-white/20 rounded-full px-5 py-2 flex-row items-center">
                            <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                            <Text className="text-white ml-2 font-medium">7-day free trial available</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Comparison Chart */}
                <View className="px-6 mb-5">
                    <Text className="text-xl font-bold text-gray-800 mb-2">
                        Choose a Plan That's Right for You
                    </Text>
                    <Text className="text-gray-600 mb-1">
                        Select the perfect plan to enhance your daily commute
                    </Text>
                </View>

                {/* Plan Cards */}
                <View className="px-6 space-y-5 mb-8 gap-8">
                    {/* Basic Plan */}
                    <TouchableOpacity
                        onPress={() => setSelectedPlan("basic")}
                        activeOpacity={0.7}
                        className={`bg-white rounded-xl p-6 border ${selectedPlan === "basic" ? "border-blue-500" : "border-gray-200"
                            } shadow-sm`}
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-lg font-bold text-gray-800">Basic Commuter</Text>
                                <Text className="text-gray-500">Essential travel features</Text>
                            </View>
                            <View className="bg-blue-100 p-3 rounded-lg">
                                <FontAwesome5 name="bus" size={20} color="#3b82f6" />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-2xl font-bold text-blue-700">
                                ₱199 <Text className="text-sm font-normal text-gray-500">/month</Text>
                            </Text>
                            <Text className="text-xs text-gray-500">or ₱1,999/year (save 16%)</Text>
                        </View>

                        <View className="mb-5 space-y-2 gap-2">
                            {features.basic.map((feature, index) => (
                                <View key={index} className="flex-row items-center">
                                    <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
                                    <Text className="text-gray-700 ml-3">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <LinearGradient
                            colors={selectedPlan === "basic" ? ["#1e40af", "#3b82f6"] : ["#f3f4f6", "#f3f4f6"]}
                            className="py-4 rounded-lg items-center"
                        >
                            <Text className={selectedPlan === "basic" ? "text-white font-bold" : "text-blue-700 font-bold"}>
                                {selectedPlan === "basic" ? "Selected" : "Choose Plan"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Premium Plan - Highlighted */}
                    <TouchableOpacity
                        onPress={() => setSelectedPlan("premium")}
                        activeOpacity={0.7}
                        className={`bg-white rounded-xl p-6 border ${selectedPlan === "premium" ? "border-blue-500" : "border-gray-200"
                            } shadow-md`}
                    >
                        <View className="absolute right-4 top-4 z-10">
                            <View className="bg-blue-600 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-bold">POPULAR</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-start mb-4 mt-2">
                            <View>
                                <Text className="text-lg font-bold text-gray-800">Premium Commuter</Text>
                                <Text className="text-gray-500">Enhanced travel experience</Text>
                            </View>
                            <View className="bg-blue-100 p-3 rounded-lg">
                                <MaterialIcons name="airline-seat-recline-extra" size={20} color="#3b82f6" />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-2xl font-bold text-blue-700">
                                ₱399 <Text className="text-sm font-normal text-gray-500">/month</Text>
                            </Text>
                            <Text className="text-xs text-gray-500">or ₱3,999/year (save 16%)</Text>
                        </View>

                        <View className="mb-5 space-y-2">
                            {features.premium.map((feature, index) => (
                                <View key={index} className="flex-row items-center">
                                    <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
                                    <Text className="text-gray-700 ml-3">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <LinearGradient
                            colors={selectedPlan === "premium" ? ["#1e40af", "#3b82f6"] : ["#f3f4f6", "#f3f4f6"]}
                            className="py-4 rounded-lg items-center"
                        >
                            <Text className={selectedPlan === "premium" ? "text-white font-bold" : "text-blue-700 font-bold"}>
                                {selectedPlan === "premium" ? "Selected" : "Choose Plan"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Business Plan */}
                    <TouchableOpacity
                        onPress={() => setSelectedPlan("business")}
                        activeOpacity={0.7}
                        className={`bg-white rounded-xl p-6 border ${selectedPlan === "business" ? "border-blue-500" : "border-gray-200"
                            } shadow-sm`}
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-lg font-bold text-gray-800">Business Commuter</Text>
                                <Text className="text-gray-500">For frequent travelers</Text>
                            </View>
                            <View className="bg-blue-100 p-3 rounded-lg">
                                <MaterialIcons name="business-center" size={20} color="#3b82f6" />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-2xl font-bold text-blue-700">
                                ₱699 <Text className="text-sm font-normal text-gray-500">/month</Text>
                            </Text>
                            <Text className="text-xs text-gray-500">or ₱6,999/year (save 16%)</Text>
                        </View>

                        <View className="mb-5 space-y-2">
                            {features.business.map((feature, index) => (
                                <View key={index} className="flex-row items-center">
                                    <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
                                    <Text className="text-gray-700 ml-3">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <LinearGradient
                            colors={selectedPlan === "business" ? ["#1e40af", "#3b82f6"] : ["#f3f4f6", "#f3f4f6"]}
                            className="py-4 rounded-lg items-center"
                        >
                            <Text className={selectedPlan === "business" ? "text-white font-bold" : "text-blue-700 font-bold"}>
                                {selectedPlan === "business" ? "Selected" : "Choose Plan"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Free Trial Banner */}
                <View className="mx-6 mb-8">
                    <LinearGradient
                        colors={["#1e3a8a", "#3b82f6"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="p-6 rounded-xl"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-white/20 p-3 rounded-full mr-4">
                                <Ionicons name="gift-outline" size={24} color="#ffffff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg mb-1">7-Day Free Trial</Text>
                                <Text className="text-white opacity-90">
                                    Try any plan risk-free. Cancel anytime before the trial ends.
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="bg-white mt-5 py-4 rounded-lg items-center"
                            activeOpacity={0.7}
                        >
                            <Text className="text-blue-700 font-bold">Start Free Trial</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* FAQ Section */}
                <View className="px-6 pb-12">
                    <Text className="text-xl font-bold text-gray-800 mb-5">Frequently Asked Questions</Text>

                    <View className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                        <Text className="font-bold text-gray-800 mb-2">When will I be charged?</Text>
                        <Text className="text-gray-600">
                            Your free trial begins today and you won't be charged until the trial period ends. You can cancel anytime before then.
                        </Text>
                    </View>

                    <View className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                        <Text className="font-bold text-gray-800 mb-2">How do I cancel my subscription?</Text>
                        <Text className="text-gray-600">
                            You can cancel your subscription anytime through the app settings. Your benefits continue until the end of your billing period.
                        </Text>
                    </View>

                    <View className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                        <Text className="font-bold text-gray-800 mb-2">Are there special rates for regular commuters?</Text>
                        <Text className="text-gray-600">
                            Yes! Our annual subscription options provide significant savings for regular commuters, with up to 16% discount compared to monthly billing.
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="items-center mt-4"
                        activeOpacity={0.7}
                    >
                        <Text className="text-blue-600 font-medium">View all FAQs</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SubscriptionUI;