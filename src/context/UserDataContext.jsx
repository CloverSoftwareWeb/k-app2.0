import { Common } from "@/constant/strings";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { createContext, useEffect, useState } from "react";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children, collectionName }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscribeToCollection } = useFirestoreQuery(collectionName);
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection((result) => {
      if (result.success) {
        setUserData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]); // Re-fetch data only when collection changes

  useEffect(() => {
    updateFieldById(Common.documentIds.statistics, { totalUser: userData.length });
  }, [userData.length]); // Runs only when user count changes

  return (
    <UserDataContext.Provider
      value={{
        data: userData,
        loading,
        error,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
