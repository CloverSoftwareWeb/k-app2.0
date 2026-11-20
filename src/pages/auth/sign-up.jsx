import {
  Input,
  Button,
  Typography,
  Select,
  Option
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useReducer, useRef, useState } from "react";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { Common } from "@/constant/strings";
import { useNavigate } from "react-router-dom";

// Get today's date in YYYY-MM-DD format
const getCurrentDate = () => new Date().toISOString().substring(0, 10);

// Initial state
const initialState = {
  name: "",
  dob: "",
  crNo: "",
  regDate: getCurrentDate(),
  renewDate: getCurrentDate(),
  expireDate: "",
  workType: "",
  customWorkType: "",
  phoneNo: "",
  address: "",
  aadharNo: "",
};

// Reducer function to handle state updates
const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export function SignUp() {
  const [useCustomWorkType, setUseCustomWorkType] = useState(false);
  const [savedWorkTypes, setSavedWorkTypes] = useState([]);
  const defaultWorkTypes = ["Mestri", "Labour", "Electrician", "Fisher Man", "Painter", "Carpenter", "Plumber"];
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { addNewDocument, findDocumentsByField } = useFirestoreQuery(Common.collectionName.customerData);
  const { addNewDocument: addWorkType, getAllData: getAllWorkTypes } = useFirestoreQuery(Common.collectionName.workTypes);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const loadSavedWorkTypes = async () => {
      try {
        const workTypes = await getAllWorkTypes();
        setSavedWorkTypes(
          workTypes
            .map(({ name }) => typeof name === "string" ? name.trim() : "")
            .filter(Boolean)
        );
      } catch (error) {
        // Registration still works if the optional work-type list cannot be loaded.
        console.error("Unable to load saved work types", error);
      }
    };

    loadSavedWorkTypes();
  }, []);

  const workOptions = [...new Set([...defaultWorkTypes, ...savedWorkTypes])];


  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const customWorkType = state.customWorkType.trim();
      const workType = useCustomWorkType ? customWorkType : state.workType.trim();

      if (!workType) {
        alert("Please select or enter a work type.");
        return;
      }

      const existing = await findDocumentsByField("crNo", state.crNo);
      if (!existing.success) {
        alert(`Failed to check existing members: ${existing.error}`);
        return;
      }

      if (existing.data.length > 0) {
        alert("A member with this CR number is already registered.");
        return;
      }

      const { customWorkType: _customWorkType, ...memberData } = state;
      const result = await addNewDocument({ ...memberData, workType });

      if (result.success) {
        if (useCustomWorkType) {
          const alreadySaved = savedWorkTypes.some(
            (savedWorkType) => savedWorkType.toUpperCase() === workType.toUpperCase()
          );

          if (!alreadySaved) {
            const savedResult = await addWorkType({
              name: workType,
              normalizedName: workType.toUpperCase(),
              createdAt: new Date().toISOString(),
            });

            if (!savedResult.success) {
              console.error("Unable to save custom work type", savedResult.error);
            }
          }
        }
        dispatch({ type: "RESET" });
        navigate("/dashboard/manage");
      } else {
        alert(`Failed to register member: ${result.error}`);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    dispatch({ type: "UPDATE_FIELD", field: e.target.name, value: e.target.value.toUpperCase() });
  };

  // Reset form
  const resetForm = () => {
    dispatch({ type: "RESET" })
    setUseCustomWorkType(false)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="text-center">
        <Typography variant="h2" className="font-bold mb-4">
          Register Here!
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
          Enter customer details.
        </Typography>
      </div>
      <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
        <div className="mb-1 flex flex-col gap-6">
          {/* Name */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Name</Typography>
          <Input type="text" size="lg" name="name" placeholder="Enter full name" 
            value={state.name} onChange={handleChange} required/>

          {/* Date of Birth */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Date of Birth</Typography>
          <input type="date" name="dob" value={state.dob} onChange={handleChange} required/>

          {/* CR Number */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">CR Number</Typography>
          <Input type="text" size="lg" name="crNo" placeholder="Enter CR Number" 
            value={state.crNo} onChange={handleChange} required/>

          {/* Card Registration Date */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Card Registration Date</Typography>
          <input type="date" name="regDate" value={state.regDate} onChange={handleChange} required/>

          {/* Card Renewal Date */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Card Renewal Date</Typography>
          <input type="date" name="renewDate" value={state.renewDate} onChange={handleChange} required/>

          {/* Card Expire Date */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Card Expire Date</Typography>
          <input type="date" name="expireDate" value={state.expireDate} onChange={handleChange} required/>

          {/* Work */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Work</Typography>
          <Select
            value={useCustomWorkType ? "Other" : state.workType}
            onChange={(value) => {
              setUseCustomWorkType(value === "Other");
              dispatch({ type: "UPDATE_FIELD", field: "workType", value: value === "Other" ? "" : value });
              if (value !== "Other") {
                dispatch({ type: "UPDATE_FIELD", field: "customWorkType", value: "" });
              }
            }}
          >
            {workOptions.map((option) => (
              <Option key={option} value={option}>{option}</Option>
            ))}
            <Option value="Other">Other</Option>
          </Select>
          {useCustomWorkType && (
            <Input
              type="text"
              size="lg"
              name="customWorkType"
              placeholder="Enter custom work type"
              value={state.customWorkType}
              onChange={handleChange}
              required
            />
          )}

          {/* Mobile */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Mobile</Typography>
          <Input type="tel" size="lg" name="phoneNo" placeholder="Enter mobile number" 
            value={state.phoneNo} onChange={handleChange} required/>

          {/* Aadhar Number */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Aadhar Number (Optional)</Typography>
          <Input type="text" size="lg" name="aadharNo" placeholder="Enter Aadhar number" 
            value={state.aadharNo} onChange={handleChange} />

          {/* Address */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Address</Typography>
          <Input type="text" size="lg" name="address" placeholder="Enter address" 
            value={state.address} onChange={handleChange} required/>
        </div>

        {/* Submit & Reset Buttons */}
        <Button type="submit" className="mt-6" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register Now"}
        </Button>
        <Button type="button" className="mt-2 bg-red-500" fullWidth onClick={resetForm}>
          Reset Form
        </Button>

        {/* Already have an account? */}
        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Already have an account?
          <Link to="/dashboard/home" className="text-gray-900 ml-1">Dashboard</Link>
        </Typography>
      </form>
    </div>
  );
}

export default SignUp;
