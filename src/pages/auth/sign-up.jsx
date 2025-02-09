import {
  Input,
  Button,
  Typography,
  Select,
  Option
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useReducer, useState } from "react";
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
  phoneNo: "",
  address: "",
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
  
  const workOptions = ["Mestri", "Labour", "Electrician", "Fisher Man", "Painter", "Carpenter", "Plumber", "Other"];
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { addNewDocument } = useFirestoreQuery(Common.collectionName.customerData)
  const navigate = useNavigate();


  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    addNewDocument(state);
    dispatch({ type: "RESET" })
    navigate("/dashboard/manage");
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
            value={useCustomWorkType ? "Custom" : state.workType}
            onChange={(value) => {
              setUseCustomWorkType(value === "Other");
              dispatch({ type: "UPDATE_FIELD", field: "workType", value: value === "Other" ? "" : value });
            }}
            disabled={useCustomWorkType}
          >
            {workOptions.map((option) => (
              <Option key={option} value={option}>{option}</Option>
            ))}
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

          {/* Address */}
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">Address</Typography>
          <Input type="text" size="lg" name="address" placeholder="Enter address" 
            value={state.address} onChange={handleChange} required/>
        </div>

        {/* Submit & Reset Buttons */}
        <Button type="submit" className="mt-6" fullWidth>Register Now</Button>
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
