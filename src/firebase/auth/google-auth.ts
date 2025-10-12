'use client';

import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(auth: Auth): Promise<void> {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const db = getFirestore(auth.app);
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

  } catch (error) {
    console.error('Google Sign-In Error:', error);
    // Optionally re-throw or handle the error in the UI
    throw error;
  }
}
