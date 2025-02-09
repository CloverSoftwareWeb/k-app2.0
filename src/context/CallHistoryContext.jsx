import { Common } from "@/constant/strings";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { createContext, useEffect, useState } from "react";
import { parse } from 'date-fns'
export const CallHistoryContext = createContext();

export const CallHistoryProvider = ({ children }) => {
    const [callData, setCallData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAllData } = useFirestoreQuery(Common.collectionName.callHistory);
    const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);
    const date = new Date()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const documents = await getAllData()
                const sortedData = documents.sort((a, b) => {
                    const dateA = parse(a.timeline, "dd/MM/yyyy hh:mm:ss a",date);
                    const dateB = parse(b.timeline, "dd/MM/yyyy hh:mm:ss a", date);
                    return dateB - dateA
                })
                setCallData(sortedData);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Re-fetch data only when collection changes

    useEffect(() => {
        if (callData.length > 0) {
            updateFieldById(Common.documentIds.statistics, { callCount: callData.length });
        }
    }, [callData]); // Runs only when userData updates

    return (
        <CallHistoryContext.Provider value={{ callData, loading, error }}>
            {children}
        </CallHistoryContext.Provider>
    );
};
