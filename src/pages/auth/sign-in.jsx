import { AuthContext } from "../../context/AuthContext";
import {
  Button,
  Input,
  Typography
} from "@material-tailwind/react";
import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  // Define constant values for validation
  const correctUsername = "admin";
  const correctPassword = "password123";

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === correctUsername && password === correctPassword) {
      login()
      setErrorMessage("");
      navigate("/dashboard/home");
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };
  
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Administrator</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your username and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your username
            </Typography>
            <Input
              size="lg"
              placeholder="user_name"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
              <Typography variant="small" color="red" className="mt-2 text-center">
                {errorMessage}
              </Typography>
            )}

          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>

        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
