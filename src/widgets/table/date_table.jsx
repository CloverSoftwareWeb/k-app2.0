import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar
} from "@material-tailwind/react";
import Loader from './components/loader'
import React, { useState } from 'react'
import Cell from "./components/cell";
import Header from "./components/header"
import ShowMore from "./components/show_more";
import CallTo from "./components/call_to"

export function DateTable({ title, data, loading, color, displayRow }) {
  // State to manage how many rows to show initially
  const [visibleRows, setVisibleRows] = useState(displayRow);

  // Show more rows
  const handleShowMore = () => {
    setVisibleRows(data?.length); // Show all rows when "Show More" is clicked
  };


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color={color} className="mb-8 p-6 opacity-90">
          <Typography variant="h6" color="white">
            {title}
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? <Loader />
            :
            data?.length > 0 ?
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["", "name", "cr no.", "expire", "mobile", ""].map((el) => (
                      <Header el={el} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.slice(0, visibleRows).map(
                    ({ name, crNo, expireDate, phoneNo }, key) => {
                      const className = `py-3 px-5 ${key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                        }`;

                      return (
                        <tr key={name}>
                          <td className={className}>
                            <Cell entity={key + 1} />
                          </td>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar src={"https://github.com/CloverSoftwareWeb/KK/blob/main/img/user.png?raw=true"} alt={name} size="sm" variant="rounded" />
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {name}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Cell entity={crNo} />
                          </td>
                          <td className={className}>
                            <Cell entity={expireDate} />
                          </td>
                          <td className={className}>
                            <Cell entity={phoneNo} />
                          </td>
                          <td className={className}>
                            <CallTo phone={phoneNo} name={name} />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              : <div className="mt-4 text-center">
                <Typography variant="h6" color="gray">
                  No data found
                </Typography>
              </div>
          }

          {/* Show More button */}
          <ShowMore data={data} visibleRows={visibleRows} handleShowMore={handleShowMore} />
        </CardBody>
      </Card>
    </div>
  )
}

export default DateTable
