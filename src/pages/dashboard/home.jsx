import { StatisticsCard } from "@/widgets/cards";
import {
  ArrowUpIcon
} from "@heroicons/react/24/outline";
import { ChatBubbleLeftIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardBody,
  CardHeader,
  Typography
} from "@material-tailwind/react";
import React, { useContext, useMemo } from "react";
import { CallHistoryContext } from "../../context/CallHistoryContext";
import { MessageHistoryContext } from "../../context/MessageHistoryContext";
import { StatisticsContext } from '../../context/StatisticsContext';
import { UserDataContext } from "../../context/UserDataContext";

function HistoryTimeline({ data, icon: Icon, emptyLabel }) {
  if (data.length === 0) {
    return (
      <Typography variant="small" className="text-blue-gray-500">
        {emptyLabel}
      </Typography>
    );
  }

  return data.slice(0, 5).map(({ name, phoneNo, timeline }, key) => (
    <div key={key} className="flex items-start gap-4 py-3">
      <div
        className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
          key === Math.min(data.length, 5) - 1
            ? "after:h-0"
            : "after:h-4/6"
        }`}
      >
        {React.createElement(Icon, {
          className: "!w-5 !h-5 text-blue-gray-300",
        })}
      </div>
      <div>
        <Typography
          variant="small"
          color="blue-gray"
          className="block font-medium"
        >
          {name}
        </Typography>
        <Typography
          variant="small"
          className="text-xs font-medium text-blue-gray-600"
        >
          {phoneNo || "N/A"}
        </Typography>
        <Typography
          as="span"
          variant="small"
          className="text-xs font-medium text-blue-gray-500"
        >
          {timeline}
        </Typography>
      </div>
    </div>
  ));
}

export function Home() {
  const { statisticsCardsData } = useContext(StatisticsContext);
  const { callData } = useContext(CallHistoryContext);
  const { messageData } = useContext(MessageHistoryContext);
  const { data: userData } = useContext(UserDataContext);

  const roleCounts = useMemo(() => {
    const counts = {};

    // Normalize workType to uppercase and trim so counting is case-insensitive
    userData.forEach(({ workType }) => {
      const raw = (workType ?? "Unassigned").toString();
      const normalized = raw.trim() === "" ? "UNASSIGNED" : raw.trim().toUpperCase();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    // Convert to display-friendly form (title case) but keep sort by normalized key
    return Object.entries(counts)
      .map(([normRole, count]) => {
        const display = normRole === "UNASSIGNED"
          ? "Unassigned"
          : normRole.charAt(0) + normRole.slice(1).toLowerCase();
        return { role: display, count, _sortKey: normRole };
      })
      .sort((a, b) => {
        // Force UNASSIGNED to the end of the list
        if (a._sortKey === "UNASSIGNED" && b._sortKey === "UNASSIGNED") return 0;
        if (a._sortKey === "UNASSIGNED") return 1;
        if (b._sortKey === "UNASSIGNED") return -1;
        return a._sortKey.localeCompare(b._sortKey);
      })
      .map(({ _sortKey, ...rest }) => rest);
  }, [userData]);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
      {statisticsCardsData.map(({ icon, title, footer, animateIcon, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: `w-6 h-6 text-white ${animateIcon ? "animate-lapse-alert" : ""}`,
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-4">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Function metrix
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["role", "count"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {roleCounts.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-6 px-6">
                      <Typography variant="small" className="text-blue-gray-500">
                        No member data available.
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  roleCounts.map(({ role, count }, key) => {
                    const className = `py-3 px-5 ${
                      key === roleCounts.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={role}>
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className={role === 'Unassigned' ? '' : 'font-bold'}
                          >
                            {role}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {count}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Call History
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>Recent</strong> calls
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <HistoryTimeline
              data={callData}
              icon={DevicePhoneMobileIcon}
              emptyLabel="No call history yet."
            />
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Message History
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>Recent</strong> messages
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <HistoryTimeline
              data={messageData}
              icon={ChatBubbleLeftIcon}
              emptyLabel="No message history yet."
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default React.memo(Home);
