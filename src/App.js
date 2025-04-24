import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import TaskListPage from './components/TaskListPage';
import ArchivedPage from './components/ArchivedPage';
import { Container, Button, Box } from '@mui/material';

const NavigationButton = () => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    const currentPath = window.location.pathname;
    if (currentPath === "/archived") {
      navigate("/"); // العودة للصفحة الرئيسية
    } else {
      navigate("/archived"); // الذهاب للصفحة الأرشيف
    }
  };

  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
      <Button variant="contained" color="primary" onClick={handleNavigate}>
        {window.location.pathname === "/archived" ? "Go to Task List" : "Go to Archived Tasks"}
      </Button>
    </Box>
  );
};

const App = () => {
  return (
    
    <Router>
      <Container maxWidth="md">
        <NavigationButton />
        <Routes>
          <Route path="/" element={<TaskListPage />} />
          <Route path="/archived" element={<ArchivedPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
