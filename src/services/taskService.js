import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "tasks";

export const subscribeToUserTasks = (userId, callback, errorCallback) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Sort client-side by createdAt descending
      tasks.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        return timeB - timeA;
      });

      callback(tasks);
    },
    (error) => {
      console.error("Firestore listener error:", error);
      if (errorCallback) errorCallback(error);
    }
  );
};

export const createTask = async (userId, {
  title,
  description,
  status,
  priority,
  dueDate,
  colorTag,
  customHex,
  isPinned,
  tags,
  isLocked,
  lockPin,
  coverImage,
}) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    userId,
    title: title.trim(),
    description: (description || "").trim(),
    status: status || "pending",
    priority: priority || "medium",
    dueDate: dueDate || null,
    colorTag: colorTag || "default",
    customHex: customHex || null,
    isPinned: Boolean(isPinned),
    tags: tags || [],
    isLocked: Boolean(isLocked),
    lockPin: lockPin || null,
    coverImage: coverImage || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateTask = async (taskId, updates) => {
  const taskRef = doc(db, COLLECTION_NAME, taskId);
  return await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId) => {
  const taskRef = doc(db, COLLECTION_NAME, taskId);
  return await deleteDoc(taskRef);
};

/**
 * Save an online snapshot backup to Firestore
 */
export const saveCloudBackup = async (userId, tasks) => {
  const backupRef = doc(db, "user_backups", userId);
  return await setDoc(backupRef, {
    userId,
    tasks,
    totalNotes: tasks.length,
    backupTimestamp: serverTimestamp(),
    lastSaved: new Date().toISOString(),
  });
};

/**
 * Fetch the latest online backup status
 */
export const getCloudBackupInfo = async (userId) => {
  const backupRef = doc(db, "user_backups", userId);
  const docSnap = await getDoc(backupRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};