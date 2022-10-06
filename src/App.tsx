import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RestoreIcon from '@mui/icons-material/Restore';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import 'reactflow/dist/style.css';
import './App.css';
import TemplateBuilder from './pages/TemplateBuilder';
import Workflows from './pages/Workflows';
import HandymanIcon from '@mui/icons-material/Handyman';
import WorkflowTemplates from './pages/WorkflowTemplates';


function App() {
  const navigate = useNavigate();
  return (
    <div className="App">

      <BottomNavigation
        showLabels
      >
        <BottomNavigationAction label="Workflows" icon={<RestoreIcon />} onClick={() => {
          navigate("/")
        }} />
        <BottomNavigationAction label="Workflow Templates" icon={<AccountTreeIcon />} onClick={() => {
          navigate("/templates")
        }} />
        <BottomNavigationAction label="Template Builder" icon={<HandymanIcon />} onClick={() => {
          navigate("/template-builder")
        }} />
      </BottomNavigation>
      <Routes>
        <Route index element={<Workflows />} />
        <Route path="templates" element={<WorkflowTemplates />} />
        <Route path="template-builder" element={<TemplateBuilder />} />
      </Routes>
    </div>
  );
}

export default App;
