import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { UserDataProvider } from './context/UserDataContext'
import { StatisticsProvider } from './context/StatisticsContext'
import { CallHistoryProvider } from './context/CallHistoryContext'
import { Common } from "./constant/strings";



function App() {

  function PrivateRoute({ element }) {
    const storedValue = localStorage.getItem("isAuthenticated")
    return storedValue === "true" ? element : <Navigate to="/auth/sign-in" replace />;
  }

  
  return (
      <UserDataProvider collectionName={Common.collectionName.customerData}>
        <CallHistoryProvider >
          <StatisticsProvider>
            <Routes>
              <Route path="/dashboard/*" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/auth/*" element={<Auth />} />
              <Route path="*" element={<PrivateRoute element={<Dashboard />} />} />
            </Routes>
          </StatisticsProvider>
        </CallHistoryProvider>
      </UserDataProvider>
  );
}

export default App;
