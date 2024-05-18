import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

const MainContainer = () => {
  return (
    <div>
      <div className="w-full min-h-screen flex flex-row">
        <div className="w-[20%] h-full bg-gray-50 min-h-screen border">
          <Sidebar />
        </div>
        <div className="w-[80%] h-full min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
