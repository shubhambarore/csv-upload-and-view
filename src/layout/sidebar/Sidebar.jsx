import React from "react";
import TableList from "../../components/table-list/TableList";
import CreateTable from "../../components/create-table/CreateTable";
import { Divider } from "@mui/material";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen items-center">
      <div className="w-full">
        <div className="w-full">
          <p data-cy="sidebar-title" className="text-left w-full p-2">
            CSV Viewer
          </p>
          <Divider />
        </div>
        <div className="w-full mt-2">
          <TableList />
        </div>
      </div>
      <CreateTable />
    </div>
  );
};

export default Sidebar;
