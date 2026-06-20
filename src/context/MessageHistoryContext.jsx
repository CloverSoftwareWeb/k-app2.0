import { Common } from "@/constant/strings";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { createContext, useEffect, useState } from "react";
import { parse } from "date-fns";

export const MessageHistoryContext = createContext();

export const MessageHistoryProvider = ({ children }) => {
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllData } = useFirestoreQuery(Common.collectionName.messageHistory);
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);
  const date = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documents = await getAllData();
        const sortedData = documents.sort((a, b) => {
          const dateA = parse(a.timeline, "dd/MM/yyyy hh:mm:ss a", date);
          const dateB = parse(b.timeline, "dd/MM/yyyy hh:mm:ss a", date);
          return dateB - dateA;
        });
        setMessageData(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (messageData.length >= 0) {
      updateFieldById(Common.documentIds.statistics, { messageCount: messageData.length });
    }
  }, [messageData]);

  return (
    <MessageHistoryContext.Provider value={{ messageData, loading, error }}>
      {children}
    </MessageHistoryContext.Provider>
  );
};
