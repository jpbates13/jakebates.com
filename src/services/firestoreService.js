import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import db from "../firebase";

// Resume
export const getResume = () => {
  const docRef = doc(db, "resume", "resume");
  return getDoc(docRef);
};

export const updateResume = (base64) => {
  const docRef = doc(db, "resume", "resume");
  return updateDoc(docRef, { base64 });
};

// Bio
export const getBio = () => {
  const docRef = doc(db, "content", "bio");
  return getDoc(docRef);
};

export const updateBio = (content) => {
  const docRef = doc(db, "content", "bio");
  return updateDoc(docRef, { content });
};

// Posts
export const subscribeToPosts = (callback) => {
  return onSnapshot(collection(db, "posts"), callback);
};

export const getPost = (id) => {
  const docRef = doc(db, "posts", id);
  return getDoc(docRef);
};

export const createPost = (id, data) => {
  const docRef = doc(db, "posts", id);
  return setDoc(docRef, data);
};

export const updatePost = (id, data) => {
  const docRef = doc(db, "posts", id);
  return updateDoc(docRef, data);
};

export const deletePost = (id) => {
  const docRef = doc(db, "posts", id);
  return deleteDoc(docRef);
};

// Drafts
export const subscribeToDrafts = (callback) => {
  return onSnapshot(collection(db, "drafts"), callback);
};

export const getDraft = (id) => {
  const docRef = doc(db, "drafts", id);
  return getDoc(docRef);
};

export const createDraft = (id, data) => {
  const docRef = doc(db, "drafts", id);
  return setDoc(docRef, data);
};

export const updateDraft = (id, data) => {
  const docRef = doc(db, "drafts", id);
  return updateDoc(docRef, data);
};

export const deleteDraft = (id) => {
  const docRef = doc(db, "drafts", id);
  return deleteDoc(docRef);
};

// Projects
export const subscribeToProjects = (callback) => {
  const collectionRef = collection(db, "projects");
  const q = query(collectionRef, orderBy("date", "desc"));
  return onSnapshot(q, callback);
};

export const saveProjects = async (projects, toDelete) => {
  const batch = writeBatch(db);
  const projectRef = collection(db, "projects");
  projects.forEach((project) => {
    const projectDoc = doc(projectRef, project.title);
    batch.set(projectDoc, project);
  });
  
  if (toDelete && toDelete.length > 0) {
    const deleteRef = collection(db, "projects");
    toDelete.forEach((projectTitle) => {
      const projectDoc = doc(deleteRef, projectTitle);
      batch.delete(projectDoc);
    });
  }
  
  return batch.commit();
};

// Office Attendance
export const getOfficeAttendance = (userId) => {
  const docRef = doc(db, "office-attendance", userId);
  return getDoc(docRef);
};

export const setOfficeAttendance = (userId, data) => {
  const docRef = doc(db, "office-attendance", userId);
  return setDoc(docRef, data);
};

// Settings
export const getBlogEnabled = () => {
  const docRef = doc(db, "content", "blogEnabled");
  return getDoc(docRef);
};

export const updateBlogEnabled = (enabled) => {
  const docRef = doc(db, "content", "blogEnabled");
  return updateDoc(docRef, { blogEnabled: enabled });
};
