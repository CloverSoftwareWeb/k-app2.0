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
import { useNavigate } from "react-router-dom";


export function CustomerTable({ title, data, loading, color, displayRow }) {
  const [visibleRows, setVisibleRows] = useState(displayRow);
  const navigate = useNavigate();

  const handleShowMore = () => {
    setVisibleRows(data?.length);
  };

  const goToProfile = ({ userId }) => {
    navigate(`/dashboard/profile/${userId}`);
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
                    {["sl", "name", "cr no.", "card expire", "mobile", ""].map((el) => (
                      <Header key={el} el={el} />
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
                        <tr key={id}>
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

          <ShowMore data={data} visibleRows={visibleRows} handleShowMore={handleShowMore} />
        </CardBody>
      </Card>
    </div>
  )
}

export default CustomerTable
