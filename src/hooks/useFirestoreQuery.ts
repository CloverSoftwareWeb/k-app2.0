import { addDoc, collection, doc, deleteDoc, endAt, getDoc, getDocs, onSnapshot, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

export const useFirestoreQuery = (collectionName) => {

  const addNewDocument = async (newData) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...newData
      });
      return { success: true, message: "added new data" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getAllData = async () => {
    const snapshot = await getDocs(collection(db, collectionName));
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return documents;
  };

  const getDocumentById = (docId, callback) => {
    // Validate callback
    const safeCallback = typeof callback === 'function' ? callback : () => {};

    try {
      const docRef = doc(db, collectionName, docId);

      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot && snapshot.exists && snapshot.exists()) {
          safeCallback({ success: true, data: snapshot.data() });
        } else {
          safeCallback({ success: false, error: "Document not found" });
        }
      }, (error) => {
        safeCallback({ success: false, error: (error && error.message) || String(error) });
      });

      // Return the unsubscribe function to stop listening when needed
      return typeof unsubscribe === 'function' ? unsubscribe : () => {};
    } catch (err) {
      safeCallback({ success: false, error: (err && err.message) || String(err) });
      return () => {};
    }
  };

  // Update a specific field in a document by ID
  const updateFieldById = async (docId, updatedData) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, updatedData);

      return { success: true, message: 'Document updated successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const searchDocuments = async (fieldName, searchValue) => {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy(fieldName), 
        startAt(searchValue),
        endAt(searchValue + "\uf8ff")
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return { success: true, data: results };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete a document by ID
  const deleteDocumentById = async (docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);  // Deletes the document from Firestore
      return { success: true, message: 'Document deleted successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { addNewDocument, getAllData, getDocumentById, updateFieldById, searchDocuments, deleteDocumentById };
};
