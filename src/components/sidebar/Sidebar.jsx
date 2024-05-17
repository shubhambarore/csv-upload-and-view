import React from "react";
import TableList from "../table-list/TableList";
import CreateTable from "../create-table/CreateTable";
import { Divider } from "@mui/material";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen items-center">
      <div className="w-full">
        <p className="text-left w-full p-2">CSV Viewer</p>
        <Divider />
      </div>
      <TableList />
      <CreateTable />
    </div>
  );
};

export default Sidebar;
