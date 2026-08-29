import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CommandLineIcon,
  StarIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, VipMembers, Manage } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile/:userId",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <CommandLineIcon {...icon} />,
        name: "manage member's",
        path: "/manage",
        element: <Manage />,
      },
      {
        icon: <StarIcon {...icon} />,
        name: "VIP members",
        path: "/vip-members",
        element: <VipMembers />,
      },
    ],
  },
  {
    title: "register",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "add new member ",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
