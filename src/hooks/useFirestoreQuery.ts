import { addDoc, collection, doc, endAt, getDoc, getDocs, onSnapshot, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

export const useFirestoreQuery = (collectionName) => {

  const addNewDocument = async (newData) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...newData
      })
      
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
    }))

    return documents
  }

  const getDocumentById = (docId, callback) => {
    try {
      const docRef = doc(db, collectionName, docId);
  
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          callback({ success: true, data: snapshot.data() });
        } else {
          callback({ success: false, error: "Document not found" });
        }
      });
  
      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (err) {
      callback({ success: false, error: err.message });
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

//   const deleteDucumentField = async (collectionName) => {
//     const snapshot = await getDocs(collection(db, collectionName));

//     snapshot.forEach(async (document) => {
//       const docRef = doc(db, collectionName, document.id);
//       await updateDoc(docRef, {
//         id: deleteField() // This removes the field
//       });
//     });
//   };

  return { addNewDocument, getAllData, getDocumentById, updateFieldById, searchDocuments };
};