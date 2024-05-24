import { DescriptionOutlined } from "@mui/icons-material";
import React from "react";

const SelectAFileToView = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <DescriptionOutlined data-cy="select-file-icon" sx={{ color: "#a7a7a7" }} fontSize="large" />
      <p data-cy="select-file-message" className="text-gray-400">
        Select a file to view content
      </p>
    </div>
  );
};

export default SelectAFileToView;
