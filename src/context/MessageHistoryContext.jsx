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
    // compute message count for current month
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyMessages = messageData.filter((m) => {
        try {
          const d = parse(m.timeline, "dd/MM/yyyy hh:mm:ss a", date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        } catch (e) {
          return false;
        }
      });

      updateFieldById(Common.documentIds.statistics, { messageCount: monthlyMessages.length });
    } catch (err) {
      console.error("Failed to compute monthly message count:", err);
    }
  }, [messageData]);

  return (
    <MessageHistoryContext.Provider value={{ messageData, loading, error }}>
      {children}
    </MessageHistoryContext.Provider>
  );
};
