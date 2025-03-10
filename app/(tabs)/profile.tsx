import React from 'react';
import { useRouter } from 'expo-router';
import ProfileScreen from '@/components/ProfileUser';

const Profile = () => {
  const router = useRouter();

  const onGoBack = () => {
    router.push("/"); // or use router.replace("/") to prevent navigating back to this screen
  };

  return <ProfileScreen onGoBack={onGoBack} />;
};

export default Profile;
