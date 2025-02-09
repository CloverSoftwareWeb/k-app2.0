import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useContext } from "react";
import { AuthProvider, AuthContext } from './context/AuthContext'
import { UserDataProvider } from './context/UserDataContext'
import { StatisticsProvider } from './context/StatisticsContext'
import { CallHistoryProvider } from './context/CallHistoryContext'
import { Common } from "./constant/strings";

function PrivateRoute({ element }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/auth/sign-in" replace />;
}

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
