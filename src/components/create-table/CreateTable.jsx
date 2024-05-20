import { Add, ClearOutlined, KeyboardBackspaceOutlined } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Papa from "papaparse";
import axios from "axios";
import DragAndDropFile from "../drag-and-drop-file/DragAndDropFile";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 220,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 3,
  outline: "none",
  borderRadius: "10px",
};

const CreateTable = () => {
  const navigate = useNavigate();
  // const [abortUploadRecord, setAbortUploadRecord] = useState(false);
  const [openCreateTableModal, setOpenCreateTableModal] = useState(false);
  const handleOpen = () => setOpenCreateTableModal(true);
  const handleClose = () => setOpenCreateTableModal(false);

  const progressInitialState = {
    percent: 0,
    records: 0,
    total: 0,
  };
  const createTableInitialStatus = {
    tableId: null,
    loading: false,
    success: false,
    failure: false,
  };
  const uplaodRecordInitialStatus = {
    loading: false,
    success: false,
    failure: false,
  };
  const fileInitialState = null;
  const [progress, setProgress] = useState(progressInitialState);
  const [createTableStatus, setCreateTableStatus] = useState(createTableInitialStatus);
  const [uploadRecordsStatus, setUploadRecordsStatus] = useState(uplaodRecordInitialStatus);

  const [abortController, setAbortController] = useState(null);
  const [abortUpload, setAbortUpload] = useState(false);

  const [file, setFile] = useState(fileInitialState);

  const uploadRecordsToTableInDB = async (tableId, records, signal) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://5.161.210.217:3000/table/${tableId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { records },
      signal: signal,
    };
    try {
      const res = await axios.request(config);
      console.log({ res });
    } catch (err) {
      console.log({ err });
    }
  };

  const bulkUploadTableRecords = async (tableId, jsonRecords) => {
    let groupedJson = [];
    let temp = [];
    jsonRecords.forEach((rec, idx) => {
      temp.push(rec);
      if (temp.length === 100) {
        groupedJson.push([...temp]);
        temp = [];
      }
    });
    if (temp.length > 0) {
      groupedJson.push([...temp]);
    }
    setUploadRecordsStatus((prev) => ({ ...prev, loading: true }));
    setProgress(0);

    const controller = new AbortController();
    setAbortController(controller);

    for (let i = 0; i < groupedJson.length; i++) {
      if (abortUpload) {
        break;
      }
      await uploadRecordsToTableInDB(tableId, groupedJson[i], controller.signal);
      setProgress({
        percent: ((i + 1) * 100) / groupedJson.length,
        records: i * 100 + groupedJson[i].length,
        total: jsonRecords.length,
      });
    }
    setProgress(progressInitialState);
    setUploadRecordsStatus((prev) => ({ ...prev, loading: false, success: true }));
  };

  const handleCreateTableInDB = async (jsonRecords) => {
    const columnNames = Object.keys(jsonRecords[0]);
    const columns = columnNames.map((cn) => {
      let type = isNaN(typeof jsonRecords[0][cn]) ? "TEXT" : "INTEGER";
      return {
        name: cn,
        type,
      };
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://5.161.210.217:3000/table",
      headers: {
        "Content-Type": "application/json",
      },
      data: { columns },
    };
    setCreateTableStatus((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axios.request(config);
      const tableId = response.data.tableId;
      setCreateTableStatus((prev) => ({
        ...prev,
        failure: false,
        success: true,
        tableId: tableId,
      }));
      bulkUploadTableRecords(tableId, jsonRecords);
    } catch (err) {
      setCreateTableStatus((prev) => ({ ...prev, failure: true }));
    } finally {
      setCreateTableStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleChangeFile = (file) => {
    setFile(file);
    setProgress(progressInitialState);
    Papa.parse(file, {
      complete: (result) => {
        handleCreateTableInDB(result.data);
      },
      header: true,
    });
  };

  const handleViewJustCreatedTable = () => {
    navigate(`/view-table/${createTableStatus.tableId}`);
    handleResetComponent();
  };

  const handleClickBack = () => {
    setProgress(progressInitialState);
    setCreateTableStatus(createTableInitialStatus);
    setUploadRecordsStatus(uplaodRecordInitialStatus);
    setFile(fileInitialState);

    handleCancelUpload();
    setAbortController(null);
    setAbortUpload(false);
  };

  const handleResetComponent = () => {
    handleClose();
    handleClickBack();
  };

  const handleCancelUpload = () => {
    if (abortController) {
      setAbortUpload(true);
      abortController.abort();
    }
  };

  return (
    <div className="w-full p-2">
      <div>
        <Modal
          open={openCreateTableModal || createTableStatus?.loading || uploadRecordsStatus?.loading}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Upload CSV</p>
              <p className="text-xs">Drag and Drop the csv file that you want to view</p>
              {createTableStatus.loading && (
                <div className="flex flex-row items-center justify-center min-h-[100px] gap-2">
                  <p className="text-xs">Creating Table...</p>
                  <CircularProgress />
                </div>
              )}
              {!createTableStatus.loading && !uploadRecordsStatus.loading && (
                <DragAndDropFile
                  abortUpload={abortUpload}
                  value={file}
                  onChange={handleChangeFile}
                  accept=".csv,text/csv"
                />
              )}
              {uploadRecordsStatus.success && (
                <div className="flex flex-row items-center justify-between mt-4">
                  <div className="border border-gray-200 rounded">
                    <Button
                      variant="none"
                      sx={{ color: "#707684" }}
                      startIcon={<KeyboardBackspaceOutlined />}
                      onClick={handleClickBack}
                    >
                      <p className="text-gray-500">Back</p>
                    </Button>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-4">
                    <div className="border border-gray-200 rounded">
                      <Button
                        variant="none"
                        sx={{ color: "#707684" }}
                        onClick={handleResetComponent}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled={abortUpload}
                        variant="contained"
                        onClick={handleViewJustCreatedTable}
                      >
                        View File
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {uploadRecordsStatus.loading && (
                <div className="flex flex-row w-full justify-between items-center gap-2 mt-5">
                  <CircularProgress />
                  <div className="flex flex-col justify-between items-center w-full gap-2">
                    <div className="flex flex-row justify-between items-center w-full">
                      <p className="text-xs text-gray-500 max-w-[200px] text-ellipsis">
                        {file?.name}
                      </p>
                      {progress.records && (
                        <p className="text-xs text-gray-500">
                          {progress.records} of {progress.total}
                        </p>
                      )}
                    </div>
                    {progress.percent && (
                      <div className="w-full">
                        <LinearProgress variant="determinate" value={progress.percent} />
                      </div>
                    )}
                  </div>
                  <IconButton onClick={handleCancelUpload}>
                    <ClearOutlined />
                  </IconButton>
                </div>
              )}
            </div>
          </Box>
        </Modal>
      </div>
      <Button onClick={handleOpen} startIcon={<Add />} variant="contained" size="small" fullWidth>
        Create Table
      </Button>
    </div>
  );
};

export default CreateTable;
