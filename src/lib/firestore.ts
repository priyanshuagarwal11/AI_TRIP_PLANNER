import { db } from './firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { AITripData } from '../types/chat';

export async function saveUserToDB(user: User) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Traveler',
      photoURL: user.photoURL || '',
      lastLogin: serverTimestamp(),
    }, { merge: true });
    console.log("User successfully saved/updated in database");
  } catch (error) {
    console.error("Error saving user to DB:", error);
  }
}

export async function saveTripToDB(userId: string, tripData: AITripData) {
  if (!userId || !tripData) return;
  const tripsRef = collection(db, 'users', userId, 'trips');
  try {
    const docRef = await addDoc(tripsRef, {
      ...tripData,
      savedAt: serverTimestamp(),
    });
    console.log("Trip saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving trip to DB:", error);
  }
}
