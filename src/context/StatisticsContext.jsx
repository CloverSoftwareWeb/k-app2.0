import { createContext, useState, useEffect } from "react";
import {
  UserPlusIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { Common } from "@/constant/strings";

export const StatisticsContext = createContext();

export const StatisticsProvider = ({ children }) => {
  const [userStatData, setUserStatData] = useState({
    totalUser: 0,
    messageCount: 0,
    lapseCount: 0,
    callCount: 0,
  });

  const { getDocumentById } = useFirestoreQuery(Common.collectionName.statistics);

  // Use updateFieldById to reset monthly counters when required
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);

  useEffect(() => {
    const unsubscribe = getDocumentById(Common.documentIds.statistics, (result) => {
      if (result.success) {
        const data = result.data || {};
        setUserStatData(data);

        try {
          // Check monthly reset
          const now = new Date();
          // use YYYY-MM format to detect month changes
          const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
          const lastReset = data.lastResetMonth || null;

          if (lastReset !== currentMonth) {
            // Reset messageCount and callCount to 0 and update lastResetMonth
            updateFieldById(Common.documentIds.statistics, {
              messageCount: 0,
              callCount: 0,
              lastResetMonth: currentMonth,
            }).then((res) => {
              if (!res.success) console.error("Failed to reset monthly counters:", res.error);
            }).catch((err) => console.error(err));
          }
        } catch (err) {
          console.error("Monthly reset check failed:", err);
        }
      } else {
        console.error("Error:", result.error);
      }
    });

    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch (err) {
        // ignore
      }
    };
  }, []);

  const statisticsCardsData = [
    {
      color: "gray",
      icon: UsersIcon,
      title: "Total Member's",
      value: userStatData?.totalUser,
      footer: {
        color: "text-green-500",
        value: `${userStatData?.totalUser ?? 0} members`,
        label: "",
      },
    },
    {
      color: "gray",
      icon: ChatBubbleLeftIcon,
      title: "Message Count/Month",
      value: userStatData?.messageCount ?? 0,
      footer: {
        color: "text-red-500",
        value: "SMS",
        label: "sent via app",
      },
    },
    {
      color: "gray",
      icon: ExclamationTriangleIcon,
      title: "Lapse/Expired Cards",
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
      title: "Call Count/Month",
      value: userStatData?.callCount,
      footer: {
        color: "text-green-500",
        value: "Call triggered from Phone",
        label: "",
      },
    },
  ];

  return (
    <StatisticsContext.Provider value={{ statisticsCardsData }}>
      {children}
    </StatisticsContext.Provider>
  );
};
