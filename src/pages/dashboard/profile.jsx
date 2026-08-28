import { Common } from "@/constant/strings";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { ProfileInfoCard } from "@/widgets/cards";
import CallTo from "@/widgets/table/components/call_to";
import SmsTo from "@/widgets/table/components/sms_to";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, updateFieldById, deleteDocumentById } = useFirestoreQuery(
    Common.collectionName.customerData
  );

  const [userData, setUserData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!userId) {
      setIsLoadingProfile(false);
      setFetchError("User not found");
      return;
    }

    setIsLoadingProfile(true);
    const unsubscribe = getDocumentById(userId, (result) => {
      if (result.success) {
        setUserData(result.data);
        setUpdatedData(result.data);
        setFetchError(null);
      } else {
        setUserData(null);
        setFetchError(result.error || "User not found");
      }
      setIsLoadingProfile(false);
    });

    return unsubscribe;
  }, [userId]);

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      setUpdatedData(userData);
    }
  };

  const handleChange = (field, value) => {
    setUpdatedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsSaving(true);
    try {
      const result = await updateFieldById(userId, updatedData);

      if (result.success) {
        setIsEditing(false);
      } else {
        alert(`Failed to save profile: ${result.error}`);
      }
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    const result = await deleteDocumentById(userId);
    setIsDeleting(false);

    if (result.success) {
      navigate("/dashboard/manage");
    } else {
      alert(`Failed to delete profile: ${result.error}`);
    }
  };

  if (isLoadingProfile) {
    return (
      <Typography variant="paragraph" color="blue-gray" className="mt-8 text-center">
        Loading profile...
      </Typography>
    );
  }

  if (fetchError || !userData) {
    return (
      <Typography variant="paragraph" color="red" className="mt-8 text-center">
        {fetchError || "User not found"}
      </Typography>
    );
  }

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
                  />
                ) : (
                  <Typography variant="small" className="font-normal text-blue-gray-600">
                    {userData?.workType}
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Tooltip content="Edit Profile">
                <PencilIcon
                  className="h-5 w-5 cursor-pointer text-blue-gray-500"
                  onClick={handleEdit}
                />
              </Tooltip>
              <Tooltip content="Delete Profile">
                <TrashIcon
                  className={`h-5 w-5 cursor-pointer text-red-500 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={handleDelete}
                />
              </Tooltip>
            </div>
          </div>

          <div className="grid-cols-1 mb-12 grid gap-12 px-5 xl:grid-cols-2">
            <ProfileInfoCard
              title="Personal Information"
              address={
                isEditing ? (
                  <Input
                    value={updatedData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
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
                  />
                ) : (
                  userData?.name
                ),
                "Date of Birth": isEditing ? (
                  <Input
                    value={updatedData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                ) : (
                  userData?.dob
                ),
                Mobile: isEditing ? (
                  <Input
                    value={updatedData.phoneNo}
                    onChange={(e) => handleChange("phoneNo", e.target.value)}
                  />
                ) : (
                  <>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {userData?.phoneNo}
                    </Typography>
                    <CallTo phone={userData?.phoneNo} name={userData?.name} />
                    <SmsTo phone={userData?.phoneNo} date={userData?.expireDate} name={userData?.name} />
                  </>
                ),
                "CR Number": isEditing ? (
                  <Input
                    value={updatedData.crNo}
                    onChange={(e) => handleChange("crNo", e.target.value)}
                  />
                ) : (
                  userData?.crNo
                ),
                "Aadhar Number": isEditing ? (
                  <Input
                    value={updatedData.aadharNo || ""}
                    onChange={(e) => handleChange("aadharNo", e.target.value)}
                    placeholder="Enter Aadhar number"
                  />
                ) : (
                  userData?.aadharNo || "NA"
                ),
                "Card Registration": isEditing ? (
                  <Input
                    value={updatedData.regDate}
                    onChange={(e) => handleChange("regDate", e.target.value)}
                  />
                ) : (
                  userData?.regDate
                ),
                "Card Renewal": isEditing ? (
                  <Input
                    value={updatedData.renewDate}
                    onChange={(e) => handleChange("renewDate", e.target.value)}
                  />
                ) : (
                  userData?.renewDate
                ),
                "Card Expiry": isEditing ? (
                  <Input
                    value={updatedData.expireDate}
                    onChange={(e) => handleChange("expireDate", e.target.value)}
                  />
                ) : (
                  userData?.expireDate
                ),
              }}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button variant="outlined" color="gray" onClick={handleEdit}>
                Cancel
              </Button>
              <Button color="blue" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
