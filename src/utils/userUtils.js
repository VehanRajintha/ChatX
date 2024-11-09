import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function createUserDocument(user, profileImage = null) {
  try {
    let photoURL = user.photoURL;

    // If a new profile image is provided, upload it to Firebase Storage
    if (profileImage) {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, profileImage);
      photoURL = await getDownloadURL(imageRef);
    }

    // Default avatar if no photo is provided
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.displayName || user.email.split('@')[0]
    )}&background=2c3e50&color=fff`;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: photoURL || defaultAvatar,
      createdAt: new Date(),
      lastSeen: new Date(),
      status: 'online',
      isPrivate: false
    }, { merge: true });

    return photoURL || defaultAvatar;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const userRef = doc(db, 'users', userId);
    
    if (updates.profileImage) {
      const imageRef = ref(storage, `profileImages/${userId}`);
      await uploadBytes(imageRef, updates.profileImage);
      updates.photoURL = await getDownloadURL(imageRef);
      delete updates.profileImage;
    }

    await setDoc(userRef, updates, { merge: true });
    return updates.photoURL;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
} 