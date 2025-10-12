'use client';

import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Create a new Google Auth provider instance
const provider = new GoogleAuthProvider();

/**
 * Initiates Google Sign-In and saves/updates user data in Firestore.
 * @param auth - The Firebase Auth instance.
 * @param db - The Firestore instance.
 */
export async function signInWithGoogle(
  auth: Auth,
): Promise<void> {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    // Handle specific errors (e.g., popup closed, account exists with different credential)
    // You could show a toast notification to the user here
  }
}
