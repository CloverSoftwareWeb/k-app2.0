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
        try {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const monthlyCalls = callData.filter((c) => {
                try {
                    const d = parse(c.timeline, "dd/MM/yyyy hh:mm:ss a", date);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                } catch (e) {
                    return false;
                }
            });

            updateFieldById(Common.documentIds.statistics, { callCount: monthlyCalls.length });
        } catch (err) {
            console.error("Failed to compute monthly call count:", err);
        }
    }, [callData]); // Runs only when callData updates

    return (
        <CallHistoryContext.Provider value={{ callData, loading, error }}>
            {children}
        </CallHistoryContext.Provider>
    );
};
