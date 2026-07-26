import { Common } from "@/constant/strings";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { createContext, useCallback, useEffect, useState } from "react";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children, collectionName }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllData } = useFirestoreQuery(collectionName);
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);

  const refreshData = async () => {
    setLoading(true);
    try {
      const documents = await getAllData();
      setUserData(documents);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [collectionName]); // Re-fetch data only when collection changes

  useEffect(() => {
    updateFieldById(Common.documentIds.statistics, { totalUser: userData.length });
  }, [userData.length]); // Runs only when user count changes

  const addUserToCache = useCallback((user) => {
    setUserData((prev) => [...prev, user]);
  }, []);

  const updateUserInCache = useCallback((userId, updates) => {
    setUserData((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    );
  }, []);

  const removeUserFromCache = useCallback((userId) => {
    setUserData((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        data: userData,
        loading,
        error,
        refreshData,
        addUserToCache,
        updateUserInCache,
        removeUserFromCache,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
