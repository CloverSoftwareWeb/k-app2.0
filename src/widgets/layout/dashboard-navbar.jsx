import {
  setOpenConfigurator,
  setOpenSidenav,
  useMaterialTailwindController,
} from "@/context";
import {
  Bars3Icon,
  ClockIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid";
import {
  Avatar,
  Breadcrumbs,
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserDataContext } from "../../context/UserDataContext";


export function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { data: userData } = useContext(UserDataContext);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    const isMobileSearch = /^\d+$/.test(trimmedQuery);
    const searchValue = isMobileSearch ? trimmedQuery : trimmedQuery.toLocaleUpperCase();

    const results = userData.filter((user) => {
      if (isMobileSearch) {
        return user.phoneNo?.includes(searchValue);
      }
      return user.name?.includes(searchValue);
    });

    setSearchResults(results);
    setShowResults(true);
  };

  const handleSearchAbort = () => {
    setTimeout(() => {
      setSearchResults([]);
      setShowResults(false)
    }, 200);
  }


  const handSignOut = () => {
    logout()
    navigate("/auth/sign-in");
  }

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onBlur={handleSearchAbort}
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute w-100 mt-1 bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-50">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    onClick={() =>
                      navigate(`/dashboard/profile/${item.id}`, { state: { user: item } })
                    }
                  >
                    <Typography variant="small" className="font-semibold text-gray-800">{item.name}</Typography>
                    <Typography variant="small" className="text-gray-500">
                      CR: {item.crNo || "N/A"} | Mobile: {item.phoneNo || "N/A"}
                    </Typography>
                  </div>
                ))}
              </div>
            )}

            {/* No Results Found */}
            {showResults && searchResults.length === 0 && (
              <div className="absolute w-full mt-1 bg-white shadow-lg rounded-lg p-2 text-gray-500 z-50">
                No results found.
              </div>
            )}
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Menu>
            <MenuHandler>
              <div>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  Admin
                </Button>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="grid xl:hidden"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
              </div>
            </MenuHandler>
            <MenuList className="w-max border-0">
                <MenuItem className="flex items-center gap-3" onClick={() => navigate('/todo')}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    My TODO
                  </Typography>
                </MenuItem>
                <hr />
              <MenuItem className="flex items-center gap-3" onClick={handSignOut}>
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    logout
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> .. minutes ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
