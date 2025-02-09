import { Common } from "@/constant/strings";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { createContext, useEffect, useState } from "react";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children, collectionName }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllData } = useFirestoreQuery(collectionName);
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documents = await getAllData()
        setUserData(documents);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]); // Re-fetch data only when collection changes

  useEffect(() => {
    if (userData.length > 0) {
      updateFieldById(Common.documentIds.statistics, { totalUser: userData.length });
    }
  }, [userData]); // Runs only when userData updates

  return (
    <UserDataContext.Provider value={{ data: userData, loading, error }}>
      {children}
    </UserDataContext.Provider>
  );
};
