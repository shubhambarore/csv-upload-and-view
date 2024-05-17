// import { FileUploader as DragAndDropFiles } from "react-drag-drop-files";

// const FileUploader = ({ value, onChange }) => {
//   return (
//     <div>
//       <DragAndDropFiles multiple={false} handleChange={onChange} types={["csv"]} />
//     </div>
//   );
// };

// export default FileUploader;

import { UploadFile } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

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

  return (
    <div>
      <label
        className="flex flex-col items-center justify-center w-full border-2 border-gray-200 border-dashed rounded cursor-pointer bg-gray-50 p-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center">
          {value ? (
            <div className="flex flex-row items-center justify-center gap-2 text-sm text-black">
              <span>{value.name}</span>
              <IconButton onClick={handleDeleteFile} aria-label="delete">
                <DeleteIcon sx={{ color: "black" }} />
              </IconButton>
            </div>
          ) : (
            <>
              <UploadFile />
              <p className="text-gray-700 text-sm">
                Drop your document here or{" "}
                <span className="text-blue-500 font-bold">browse file</span>
              </p>
              <p className="text-gray-400 text-xs">Supported: CSV</p>
            </>
          )}
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
