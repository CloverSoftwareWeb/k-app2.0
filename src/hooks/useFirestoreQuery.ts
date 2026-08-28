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
  where,
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
      ...docSnap.data(),
      id: docSnap.id,
    }));
  };

  const subscribeToCollection = (
    callback: (result: { success: boolean; data?: Record<string, unknown>[]; error?: string }) => void
  ) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};

    try {
      return onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          safeCallback({
            success: true,
            data: snapshot.docs.map((docSnap) => ({
              ...docSnap.data(),
              id: docSnap.id,
            })),
          });
        },
        (error) => safeCallback({ success: false, error: error.message })
      );
    } catch (err) {
      safeCallback({ success: false, error: err?.message || String(err) });
      return () => {};
    }
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
        data: { ...snapshot.data(), id: snapshot.id },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const findDocumentsByField = async (fieldName: string, value: unknown) => {
    try {
      const snapshot = await getDocs(
        query(collection(db, collectionName), where(fieldName, '==', value))
      );
      return {
        success: true,
        data: snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })),
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
            safeCallback({ success: true, data: { ...snapshot.data(), id: snapshot.id } });
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
        ...docSnap.data(),
        id: docSnap.id,
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
    subscribeToCollection,
    fetchDocumentById,
    findDocumentsByField,
    getDocumentById,
    updateFieldById,
    searchDocuments,
    deleteDocumentById,
  };
};
