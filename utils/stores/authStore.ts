import { makeAutoObservable, runInAction } from 'mobx';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { auth } from '@/config/firebaseConfig'; // Correctly import Firebase auth

class AuthStore {
    user: User | null = null;
    isLoading: boolean = true;

    constructor() {
        makeAutoObservable(this);
        this.checkAuthStatus();
    }

    // Computed property: Check if user is authenticated
    get isAuthenticated() {
        return this.user !== null;
    }

    // Listen for authentication state changes
    checkAuthStatus() {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const token = await currentUser.getIdToken();
                await SecureStore.setItemAsync('authToken', token);
                runInAction(() => {
                    this.user = currentUser;
                    this.isLoading = false;
                });
            } else {
                await SecureStore.deleteItemAsync('authToken');
                runInAction(() => {
                    this.user = null;
                    this.isLoading = false;
                });
                router.replace('/authentication/signin'); // Redirect to sign-in page
            }
        });
    }

    // Login function
    async login(email: string, password: string) {
        this.isLoading = true;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            await SecureStore.setItemAsync('authToken', token);

            runInAction(() => {
                this.user = userCredential.user;
                this.isLoading = false;
            });

            router.replace('/'); // Redirect to home
        } catch (error: any) {
            console.error('Login failed:', error.message);
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // Logout function
    async logout() {
        try {
            await signOut(auth);
            await SecureStore.deleteItemAsync('authToken');

            runInAction(() => {
                this.user = null;
            });

            router.replace('/authentication/signin'); // Redirect to sign-in
        } catch (error: any) {
            console.error('Logout failed:', error.message);
        }
    }
}

// Export singleton instance of AuthStore
export const authStore = new AuthStore();
