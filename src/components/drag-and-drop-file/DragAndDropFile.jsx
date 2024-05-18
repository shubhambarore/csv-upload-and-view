// import { FileUploader as DragAndDropFiles } from "react-drag-drop-files";

// const FileUploader = ({ value, onChange }) => {
//   return (
//     <div>
//       <DragAndDropFiles multiple={false} handleChange={onChange} types={["csv"]} />
//     </div>
//   );
// };

// export default FileUploader;

import { InsertDriveFile, InsertDriveFileOutlined, UploadFile } from "@mui/icons-material";

const DragAndDropFile = ({ value, onChange, accept }) => {
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }

    // Reset the input to allow selecting/dropping a new file
    const inputElement = document.getElementById("dropzone-file");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUploadFileManually = (event) => {
    onChange(event.target.files ? event.target.files[0] : null);
    event.target.value = "";
  };

  const handleDeleteFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(null);
  };

  const getFileSizeInMB = (bytes) => {
    if (!isNaN(bytes)) {
      return (bytes / (1024 * 1024)).toFixed(2);
    }
    return "";
  };

  if (value) {
    return (
      <div className="flex flex-row items-center gap-4 mt-3">
        <div className="bg-gray-100 p-2 rounded">
          <InsertDriveFileOutlined sx={{ color: "#a7a7a7" }} fontSize="large" />
        </div>
        <div>
          <p className="text-xs text-gray-400">{value?.name}</p>
          <p className="text-xs text-gray-400">{getFileSizeInMB(value?.size)} Mb</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        className="flex flex-col items-center justify-center w-full border-2 border-gray-200 border-dashed rounded cursor-pointer bg-gray-50 p-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center">
          <>
            <UploadFile />
            <p className="text-gray-700 text-sm">
              Drop your document here or{" "}
              <span className="text-blue-500 font-bold">browse file</span>
            </p>
            <p className="text-gray-400 text-xs">Supported: CSV</p>
          </>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleUploadFileManually}
          accept={accept}
        />
      </label>
    </div>
  );
};

export default DragAndDropFile;
