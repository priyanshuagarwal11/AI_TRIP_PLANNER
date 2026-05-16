import { db } from './firebase';
import { doc, setDoc, getDoc, getDocs, serverTimestamp, collection, addDoc, query, orderBy, limit, where, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { AITripData } from '../types/chat';

// ─── User Role Type ───
export type UserRole = 'user' | 'admin';

// ─── Save / Update user to DB with role ───
export async function saveUserToDB(user: User) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const existing = await getDoc(userRef);
    const baseData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Traveler',
      photoURL: user.photoURL || '',
      lastLogin: serverTimestamp(),
    };
    // Only set role on first creation — never overwrite existing role
    if (!existing.exists()) {
      baseData.role = 'user'; // Default role
      baseData.createdAt = serverTimestamp();
    }
    await setDoc(userRef, baseData, { merge: true });
  } catch (error) {
    console.error("Error saving user to DB:", error);
  }
}

// ─── Get user role ───
export async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return (snap.data().role as UserRole) || 'user';
    }
  } catch (error) {
    console.error("Error getting user role:", error);
  }
  return 'user';
}

// ─── Get user profile ───
export async function getUserProfile(uid: string) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error("Error getting profile:", error);
  }
  return null;
}

// ─── Save trip to DB ───
export async function saveTripToDB(userId: string, tripData: AITripData) {
  if (!userId || !tripData) return;
  const tripsRef = collection(db, 'users', userId, 'trips');
  try {
    const docRef = await addDoc(tripsRef, {
      ...tripData,
      savedAt: serverTimestamp(),
    });
    // Log activity
    await logActivity(userId, 'trip_saved', { destination: (tripData as any).destination });
    return docRef.id;
  } catch (error) {
    console.error("Error saving trip to DB:", error);
  }
}

// ─── Activity Logging ───
export async function logActivity(uid: string, action: string, meta?: Record<string, any>) {
  try {
    await addDoc(collection(db, 'activities'), {
      uid,
      action,
      meta: meta || {},
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

// ─── Admin: Get all users ───
export async function getAllUsers(limitCount = 50) {
  try {
    const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// ─── Admin: Get recent activities ───
export async function getRecentActivities(limitCount = 30) {
  try {
    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

// ─── Admin: Get total counts ───
export async function getAdminStats() {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const activitiesSnap = await getDocs(query(collection(db, 'activities'), where('action', '==', 'trip_saved')));
    const searchSnap = await getDocs(query(collection(db, 'activities'), where('action', '==', 'trip_generated')));
    return {
      totalUsers: usersSnap.size,
      totalTrips: activitiesSnap.size,
      totalSearches: searchSnap.size,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { totalUsers: 0, totalTrips: 0, totalSearches: 0 };
  }
}

// ─── Admin: Delete user ───
export async function deleteUserData(uid: string) {
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

// ─── Admin: Update user role ───
export async function updateUserRole(uid: string, role: UserRole) {
  try {
    await updateDoc(doc(db, 'users', uid), { role });
  } catch (error) {
    console.error("Error updating role:", error);
  }
}
