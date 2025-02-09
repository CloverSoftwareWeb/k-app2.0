import { createContext, useState, useEffect, useCallback } from "react";
import {
  UserPlusIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { Common } from "@/constant/strings";

export const StatisticsContext = createContext();

export const StatisticsProvider = ({ children }) => {
  const [userStatData, setUserStatData] = useState({
    totalUser: 0,
    newClients: 0,
    lapseCount: 0,
    callCount: 0,
  });

  const { getDocumentById } = useFirestoreQuery(Common.collectionName.statistics);


  useEffect(() => {
    const unsubscribe = getDocumentById(Common.documentIds.statistics, (result) => {
        if (result.success) {
            setUserStatData(result.data);
        } else {
          console.error("Error:", result.error);
        }
      })

    return () => unsubscribe
  }, []); 



  const statisticsCardsData = [
    {
      color: "gray",
      icon: UsersIcon,
      title: "Total Users",
      value: userStatData?.totalUser,
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: UserPlusIcon,
      title: "New Clients",
      value: userStatData?.newClients,
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than last week",
      },
    },
    {
      color: "gray",
      icon: ExclamationTriangleIcon,
      title: "Lapse 🚨",
      value: userStatData?.lapseCount,
      footer: {
        color: "text-green-500",
        value: "Call",
        label: "them soon",
      },
    },
    {
      color: "gray",
      icon: DevicePhoneMobileIcon,
      title: "Call Count",
      value: userStatData?.callCount,
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
  ];

  return (
    <StatisticsContext.Provider value={{ statisticsCardsData }}>
      {children}
    </StatisticsContext.Provider>
  );
};
