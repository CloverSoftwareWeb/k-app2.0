import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button
} from "@material-tailwind/react";
import Loader from './components/loader'
import React, { useState } from 'react'
import Cell from "./components/cell";
import Header from "./components/header"
import ShowMore from "./components/show_more";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export function CustomerTable({ title, data, loading, color, displayRow }) {
  // State to manage how many rows to show initially
  const [visibleRows, setVisibleRows] = useState(displayRow);
  const navigate = useNavigate();

  // Show more rows
  const handleShowMore = () => {
    setVisibleRows(data?.length); // Show all rows when "Show More" is clicked
  };

  const goToProfile = ({ userId }) => {
    navigate(`/profile/${userId}`);
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
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["name", "cr no.", "card expire", "mobile", ""].map((el) => (
                      <Header el={el} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, visibleRows).map(
                    ({ name, crNo, expireDate, phoneNo, id }, key) => {
                      const className = `py-3 px-5 ${key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                        }`;

                      return (
                        <tr key={name}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar src={"./img/user.png"} alt={name} size="sm" variant="rounded" />
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
                            <Typography
                              as="a"
                              href="#"
                              className="text-xs font-semibold text-blue-gray-600"
                            >
                              <Button variant="text" onClick={() => goToProfile({ userId: id })} >
                                Profile
                              </Button>
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
          }

          {/* Show More button */}
          <ShowMore data={data} visibleRows={visibleRows} handleShowMore={handleShowMore} />
        </CardBody>
      </Card>
    </div>
  )
}

export default CustomerTable
