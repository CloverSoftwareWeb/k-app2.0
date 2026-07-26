import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  endAt,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  startAt,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const stripDocumentId = (data: Record<string, unknown>) => {
  const { id: _id, ...rest } = data;
  return rest;
};

export const useFirestoreQuery = (collectionName: string) => {
  const addNewDocument = async (newData: Record<string, unknown>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), { ...newData });
      return { success: true, id: docRef.id, message: 'added new data' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getAllData = async () => {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  };

  const fetchDocumentById = async (docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return { success: false, error: 'Document not found' };
      }

      return {
        success: true,
        data: { id: snapshot.id, ...snapshot.data() },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getDocumentById = (docId: string, callback: (result: { success: boolean; data?: Record<string, unknown>; error?: string }) => void) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};

    try {
      const docRef = doc(db, collectionName, docId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            safeCallback({ success: true, data: { id: snapshot.id, ...snapshot.data() } });
          } else {
            safeCallback({ success: false, error: 'Document not found' });
          }
        },
        (error) => {
          safeCallback({ success: false, error: error?.message || String(error) });
        }
      );

      return typeof unsubscribe === 'function' ? unsubscribe : () => {};
    } catch (err) {
      safeCallback({ success: false, error: err?.message || String(err) });
      return () => {};
    }
  };

  const updateFieldById = async (docId: string, updatedData: Record<string, unknown>) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, stripDocumentId(updatedData));
      return { success: true, message: 'Document updated successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const searchDocuments = async (fieldName: string, searchValue: string) => {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy(fieldName),
        startAt(searchValue),
        endAt(searchValue + '\uf8ff')
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      return { success: true, data: results };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteDocumentById = async (docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true, message: 'Document deleted successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    addNewDocument,
    getAllData,
    fetchDocumentById,
    getDocumentById,
    updateFieldById,
    searchDocuments,
    deleteDocumentById,
  };
};
