import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
  } from 'firebase/auth';
  import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
  } from 'firebase/firestore';
  import { auth, db } from './firebase';
  import { UserProfile, UserStatus, UserRole } from '../types';
  
  // Register new user
  export const registerUser = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
  
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        email: email,
        name: name,
        role: 'user',
        status: 'pending',
        createdAt: Date.now(),
        avatarInitials: name.substring(0, 2).toUpperCase(),
      };
  
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
  
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
  
  // Login user
  export const loginUser = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
  
  // Logout user
  export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
  };
  
  // Get current user profile
  export const getCurrentUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };
  
  // Check if user is approved
  export const isUserApproved = async (userId: string): Promise<boolean> => {
    const profile = await getCurrentUserProfile(userId);
    return profile?.status === 'approved';
  };
  
  // Auth state observer
  export const onAuthStateChange = (
    callback: (user: FirebaseUser | null) => void
  ) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Get all users (admin only)
  export const getAllUsers = async (): Promise<UserProfile[]> => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((doc) => doc.data() as UserProfile);
  };
  
  // Get pending users
  export const getPendingUsers = async (): Promise<UserProfile[]> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as UserProfile);
  };
  
  // Approve user (admin only)
  export const approveUser = async (
    userId: string,
    adminId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'approved',
        approvedAt: Date.now(),
        approvedBy: adminId,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
  
  // Reject user (admin only)
  export const rejectUser = async (
    userId: string,
    adminId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'rejected',
        approvedBy: adminId,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };