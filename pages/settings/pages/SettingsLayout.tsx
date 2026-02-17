import { Outlet } from "react-router-dom";
import SettingsSidebar from "../components/SettingsSidebar";

export default function SettingsLayout() {
  return (
    // <div className="flex h-full">
    //   <SettingsSidebar />
    //   <div className="flex-1 p-8 bg-gray-50">
    //     <Outlet />
    //   </div>
    // </div>

  <div className="flex min-h-screen bg-gray-50">
    <SettingsSidebar />

    <div className="flex-1 p-8 overflow-auto">
      <Outlet />
    </div>
  </div>


  );
}
