import {
  IconArrowLeftBar,
  IconArrowLeftDashed,
  IconMessage2,
  IconSettings2,
  IconSquareChevronLeft,
  IconSquareChevronsLeft,
  IconUpload,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className="h-screen relative bg-orange-100 transition-all p-4"
      style={{
        width: collapsed ? "4rem" : "16rem",
      }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer absolute top-4 right-4"
      >
        <IconSquareChevronsLeft
          className="text-orange-600 transition-all duration-300"
          style={{
            rotate: collapsed ? "180deg" : "0deg",
          }}
          size={24}
        />
      </button>

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col items-center mt-16 gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-orange-200 text-orange-800"
                  : "text-orange-600 hover:bg-orange-200"
              }`
            }
            style={{
              width: collapsed ? "" : "90%",
            }}
          >
            <IconMessage2 size={24} />
            {!collapsed && <span className="text-sm">Chat</span>}
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-orange-200 text-orange-800"
                  : "text-orange-600 hover:bg-orange-200"
              }`
            }
            style={{
              width: collapsed ? "" : "90%",
            }}
          >
            <IconUpload size={24} />
            {!collapsed && <span className="text-sm">Pdf Upload</span>}
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-orange-200 text-orange-800"
                  : "text-orange-600 hover:bg-orange-200"
              }`
            }
            style={{
              width: collapsed ? "" : "90%",
            }}
          >
            <IconSettings2 size={24} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
