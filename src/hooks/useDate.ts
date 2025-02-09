import { format, endOfMonth, addDays, isBefore, differenceInYears } from 'date-fns';

export const useDate = () => {
  const now = new Date();
  const nextDay = addDays(now, 1);
  const endOfCurrentMonth = endOfMonth(now);

  const getCurrentDataAndTime = () =>
    new Date()
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(",", "");

  // Reusable function to filter, sort, and format dates
  const filterAndFormatData = (data, filterCondition, sortOrder) =>
    data
      ?.filter((item) => filterCondition(new Date(item.expireDate)))
      .sort((a, b) => (sortOrder === "asc" ? new Date(a.expireDate) - new Date(b.expireDate) : new Date(b.expireDate) - new Date(a.expireDate)))
      .map((item) => ({
        ...item,
        expireDate: format(new Date(item.expireDate), 'dd-MM-yyyy'),
      }));

  const getNextMonthData = (data) =>
    filterAndFormatData(data, (date) => date >= nextDay && date <= endOfCurrentMonth, "asc");

  const getPastExpiredData = (data) =>
    filterAndFormatData(data, (date) => isBefore(date, now), "asc");

  const calculateAge = (dob) => differenceInYears(now, new Date(dob));

  const getPeopleOver60 = (data) => data?.filter((item) => calculateAge(item.dob) >= 60);

  return { getCurrentDataAndTime, getNextMonthData, getPastExpiredData, calculateAge, getPeopleOver60 };
};
