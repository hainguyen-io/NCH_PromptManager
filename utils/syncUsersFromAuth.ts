/**
 * Utility script to sync users from Firebase Authentication to Firestore
 * 
 * This script helps sync users that were created directly in Firebase Console
 * but don't have corresponding documents in Firestore collection 'users'
 * 
 * Usage: Call this function from browser console or create a migration script
 */

import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserProfile } from '../types';

/**
 * Sync a single user from Firebase Auth to Firestore
 * Call this from browser console after getting user from Firebase Auth
 */
export const syncUserToFirestore = async (
  userId: string,
  email: string,
  name: string,
  createdAt?: number
): Promise<void> => {
  try {
    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      console.log(`✅ User ${userId} already exists in Firestore`);
      return;
    }

    // Create user profile
    const userProfile: UserProfile = {
      id: userId,
      email: email,
      name: name || email.split('@')[0], // Use email prefix if no name
      role: 'user',
      status: 'pending', // Default to pending
      createdAt: createdAt || Date.now(),
      avatarInitials: (name || email.split('@')[0]).substring(0, 2).toUpperCase(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', userId), userProfile);
    console.log(`✅ Synced user ${userId} to Firestore:`, userProfile);
  } catch (error) {
    console.error(`❌ Error syncing user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get all users from Firestore for debugging
 */
export const getAllFirestoreUsers = async (): Promise<UserProfile[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as UserProfile[];
    
    console.log('📊 Users in Firestore:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Status: ${user.status}`);
    });
    
    return users;
  } catch (error) {
    console.error('❌ Error getting Firestore users:', error);
    throw error;
  }
};
