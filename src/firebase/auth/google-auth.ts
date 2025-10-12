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
import { getFirestore } from 'firebase/firestore';
import { useFirebaseApp } from '../provider';

const provider = new GoogleAuthProvider();

async function updateUserProfile(user: User, db: Firestore): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    };

    setDoc(userRef, userData, { merge: true }).catch((error) => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData,
        })
      );
    });
}

export function useUpdateUserProfile() {
  const app = useFirebaseApp();
  const db = getFirestore(app);

  return (user: User) => updateUserProfile(user, db);
}


export async function signInWithGoogle(
  auth: Auth,
): Promise<void> {
  try {
    const result = await signInWithPopup(auth, provider);
    
    // We can't call useUpdateUserProfile here as this isn't a hook.
    // Instead we will re-implement the logic of creating a user profile doc.
    const app = auth.app;
    const db = getFirestore(app);
    const userRef = doc(db, 'users', result.user.uid);
    const userData = {
      uid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      photoURL: result.user.photoURL,
    };

    setDoc(userRef, userData, { merge: true }).catch((error) => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData,
        })
      );
    });

  } catch (error) {
    console.error('Google Sign-In Error:', error);
  }
}
