import { DescriptionOutlined } from "@mui/icons-material";
import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const ViewTable = () => {
  const [tableData, setTableData] = useState({
    loading: false,
    success: false,
    failure: false,
    records: null,
  });

  const [columns, setColumns] = useState([]);
  const { tableId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"));

  const [totalPages, setTotalPages] = useState(1);

  const fetchTableRecordsFromDB = async (id, pageNumber) => {
    setColumns(null);
    setTableData((prev) => ({ ...prev, loading: true, records: null }));
    try {
      const res = await axios.get(`http://5.161.210.217:3000/table/${id}?page=${pageNumber}`);
      let { page, records, totalPages } = res.data;
      setTableData((prev) => ({ ...prev, loading: false, success: true, records: records }));
      setTotalPages(totalPages);
      if (records.length > 0) {
        setColumns(Object.keys(records[0]));
      }
    } catch (err) {
      setTableData((prev) => ({
        ...prev,
        loading: false,
        success: false,
        failure: true,
      }));
    }
  };

  const handleChangePage = (event, value) => {
    setSearchParams({ page: value });
  };

  useEffect(() => {
    if (!page) {
      setSearchParams({ page: 1 });
    }
    if (tableId && page != undefined) {
      fetchTableRecordsFromDB(tableId, page);
    }
  }, [tableId, searchParams]);

  if (tableData?.success && tableData?.records?.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">Empty table...</div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      {tableData?.loading && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-2">
          <CircularProgress />
          <p>Loading Records...</p>
        </div>
      )}
      <TableContainer component={Paper} className="h-[90vh] overflow-auto bg-red-500">
        <Table size="small">
          <TableHead className="bg-gray-200">
            <TableRow>
              {columns?.length > 0 && columns.map((col) => <TableCell key={col}>{col}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.records?.length > 0 &&
              tableData.records.map((record, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell className="w-[200px]" key={col}>
                      {record[col]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages && page && (
        <div className="w-full mt-5 flex flex-row items-center justify-center">
          <Pagination
            color="primary"
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
          />
        </div>
      )}
    </div>
  );
};

export default ViewTable;
