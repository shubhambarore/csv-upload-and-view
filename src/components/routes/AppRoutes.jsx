import { Route, Routes } from "react-router-dom";
import MainContainer from "../../layout/maincontainer/MainContainer";
import ViewTable from "../view-table/ViewTable";
import SelectAFileToView from "../ no-file-selected/SelectAFileToView";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContainer />}>
        <Route path="/" element={<SelectAFileToView />} />
        <Route path="/view-table" element={<SelectAFileToView />} />
        <Route path="/view-table/:tableId" element={<ViewTable />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
