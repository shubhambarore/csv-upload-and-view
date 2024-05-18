import {
  DescriptionOutlined,
  Inventory2Outlined,
  KeyboardArrowRightOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TableList = () => {
  const tableNamesInitialState = {
    loading: false,
    success: false,
    failure: false,
    tables: [],
    page: null,
    totalPages: null,
  };
  const [tableNames, setTableNames] = useState(tableNamesInitialState);
  const location = useLocation();

  const fetchTableNamesFromDB = async () => {
    setTableNames((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.get("http://5.161.210.217:3000/table");

      setTableNames((prev) => ({
        ...prev,
        loading: false,
        success: true,
        tables: res.data.tables,
        page: res.data.page,
        totalPages: res.data.totalPages,
      }));
    } catch (err) {
      setTableNames((prev) => ({ ...prev, loading: false, success: false, failure: true }));
    }
  };

  useEffect(() => {
    fetchTableNamesFromDB();
  }, []);

  if (tableNames?.success && tableNames?.tables?.length == 0) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <Inventory2Outlined sx={{ color: "#a7a7a7" }} fontSize="large" />
        <p className="text-gray-400">No CSV file uploaded</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col justify-start items-start max-h-[85vh] overflow-auto gap-2 w-full p-1">
        {tableNames?.tables?.map((tn, idx) => {
          const isActive = location.pathname == `/view-table/${tn}`;
          return (
            <Link
              key={tn}
              to={`/view-table/${tn}`}
              className={`cursor-pointer w-full px-2 hover:bg-gray-200 p-1 rounded ${
                isActive ? "bg-white" : ""
              }`}
            >
              <div className="flex flex-row justify-start items-center gap-2">
                <div className="flex flex-row justify-start items-center gap-2 w-[80%]">
                  <DescriptionOutlined fontSize="small" />
                  <p className="text-gray-600 text-xs">{tn}</p>
                </div>
                {isActive && (
                  <div className="flex flex-row justify-start items-center gap-2">
                    <MoreVertOutlined fontSize="small" />
                    <KeyboardArrowRightOutlined fontSize="small" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TableList;
