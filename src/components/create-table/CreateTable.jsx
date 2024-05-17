import { Add, ClearOutlined } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Papa from "papaparse";
import axios from "axios";
import DragAndDropFile from "../drag-and-drop-file/DragAndDropFile";

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
  const [openCreateTableModal, setOpenCreateTableModal] = useState(false);
  const handleOpen = () => setOpenCreateTableModal(true);
  const handleClose = () => setOpenCreateTableModal(false);

  const [progress, setProgress] = useState({
    percent: 0,
    records: 0,
    total: 0,
  });
  const [createTableLoading, setCreateTableLoading] = useState(false);
  const [uploadRecordsLoading, setUploadRecordsLoading] = useState(false);

  const [file, setFile] = useState(null);

  const uploadRecordsToTableInDB = async (tableId, records) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://5.161.210.217:3000/table/${tableId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { records },
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
    setUploadRecordsLoading(true);
    setProgress(0);
    for (let i = 0; i < groupedJson.length; i++) {
      await uploadRecordsToTableInDB(tableId, groupedJson[i]);
      setProgress({
        percent: ((i + 1) * 100) / groupedJson.length,
        records: i * 100 + groupedJson[i].length,
        total: jsonRecords.length,
      });
    }
    setProgress(0);
    setUploadRecordsLoading(false);
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
    setCreateTableLoading(true);
    try {
      const response = await axios.request(config);
      const tableId = response.data.tableId;
      bulkUploadTableRecords(tableId, jsonRecords);
    } catch (err) {
      console.log(err);
    } finally {
      setCreateTableLoading(false);
    }

    // axios
    //   .request(config)
    //   .then((response) => {
    //     setProgress(0);
    //     (async () => {
    //       for (let i = 0; i < jsonRecords.length; i++) {
    //         let payload = [];
    //         for (let j = 0; j < 100 && i < jsonRecords.length; j++) {
    //           payload.push(jsonRecords[i]);
    //           i++;
    //         }
    //         await handleUplaodRecordsToTable(response.data.tableId, payload);
    //         setProgress(((i + 1) * 100) / jsonRecords.length);
    //       }
    //     })();

    //     // setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const handleChangeFile = (file) => {
    setFile(file);
    Papa.parse(file, {
      complete: (result) => {
        handleCreateTableInDB(result.data);
      },
      header: true,
    });
  };

  return (
    <div className="w-full p-2">
      <div>
        <Modal
          open={true}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Upload CSV</p>
              <p className="text-xs">Drag and Drop the csv file that you want to view</p>
              {createTableLoading && (
                <div className="flex flex-row items-center justify-center min-h-[100px] gap-2">
                  <p className="text-xs">Creating Table...</p>
                  <CircularProgress />
                </div>
              )}
              {!createTableLoading && !uploadRecordsLoading && (
                <DragAndDropFile value={file} onChange={handleChangeFile} accept=".csv,text/csv" />
              )}
              {uploadRecordsLoading && (
                <div className="flex flex-row w-full justify-between items-center gap-2 mt-5">
                  <CircularProgress />
                  <div className="flex flex-col justify-between items-center w-full gap-2">
                    <div className="flex flex-row justify-between items-center w-full">
                      <p className="text-xs text-gray-500 max-w-[200px] text-ellipsis">
                        {file?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {progress.records} of {progress.total}
                      </p>
                    </div>
                    <div className="w-full">
                      <LinearProgress variant="determinate" value={progress.percent} />
                    </div>
                  </div>
                  <IconButton>
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
