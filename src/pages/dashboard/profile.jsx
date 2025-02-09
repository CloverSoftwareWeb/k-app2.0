import { Common } from "@/constant/strings";
import { ProfileInfoCard } from "@/widgets/cards";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Card,
  CardBody,
  Tooltip,
  Typography,
  Input,
  Button
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import CallTo from "@/widgets/table/components/call_to";

export function Profile() {
  const { userId } = useParams();
  // collection name should be same as per user context 
  const { getDocumentById, updateFieldById } = useFirestoreQuery(Common.collectionName.customerData);

  const [userData, setUserData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = getDocumentById(userId, (result) => {
      if (result.success) {
        setUserData(result.data);
        setUpdatedData(result.data);
      } else {
        console.error("Error:", result.error);
      }
    })

    return () => unsubscribe
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setUpdatedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    setUserData(updatedData);
    updateFieldById(userId, updatedData)
    setIsEditing(false);
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('https://github.com/CloverSoftwareWeb/KK/blob/main/img/background-image.png?raw=true')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="https://github.com/CloverSoftwareWeb/KK/blob/main/img/user.png?raw=true"
                alt="User"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userData?.name}
                </Typography>
                {isEditing ? (
                  <Input
                    value={updatedData.workType}
                    onChange={(e) => handleChange("workType", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  <Typography variant="small" className="font-normal text-blue-gray-600">
                    {userData?.workType}
                  </Typography>
                )}
              </div>
            </div>
            <Tooltip content="Edit Profile">
              <PencilIcon className="h-5 w-5 cursor-pointer text-blue-gray-500" onClick={handleEdit} />
            </Tooltip>
          </div>

          <div className="grid-cols-1 mb-12 grid gap-12 px-5 xl:grid-cols-2">
            <ProfileInfoCard
              title="Personal Information"
              address={
                isEditing ? (
                  <Input
                    value={updatedData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.address ?? ""
                )
              }
              details={{
                "First Name": isEditing ? (
                  <Input
                    value={updatedData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.name
                ),
                "Date of Birth": isEditing ? (
                  <Input
                    value={updatedData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.dob
                ),
                "Mobile": isEditing ? (
                  <Input
                    value={updatedData.phoneNo}
                    onChange={(e) => handleChange("phoneNo", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  <>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >

                      {userData?.phoneNo}
                    </Typography>
                    <CallTo phone={userData?.phoneNo} name={userData?.name} />
                  </>
                ),
                "CR Number": isEditing ? (
                  <Input
                    value={updatedData.crNo}
                    onChange={(e) => handleChange("crNo", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.crNo
                ),
                "Card Registration": isEditing ? (
                  <Input
                    value={updatedData.regDate}
                    onChange={(e) => handleChange("regDate", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.regDate
                ),
                "Card Renewal": isEditing ? (
                  <Input
                    value={updatedData.renewDate}
                    onChange={(e) => handleChange("renewDate", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.renewDate
                ),
                "Card Expiry": isEditing ? (
                  <Input
                    value={updatedData.expireDate}
                    onChange={(e) => handleChange("expireDate", e.target.value)}
                    onBlur={handleBlur}
                  />
                ) : (
                  userData?.expireDate
                ),
              }}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button color="blue" onClick={handleBlur}>Save</Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
