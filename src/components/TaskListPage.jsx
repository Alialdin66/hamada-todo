// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, TextField, Card, Typography, Box, Snackbar,Alert} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { addTask, archiveTask, checkAndUpdateTasks } from '../redux/tasksSlice';
// import { motion } from 'framer-motion';


// const TaskListPage = () => {
//   const [taskTitle, setTaskTitle] = useState('');
//   const [multiplier, setMultiplier] = useState(1);
//   const [openSnackbar, setOpenSnackbar] = useState(false);  
//   const [progress, setProgress] = useState(0);
//   const dispatch = useDispatch();
//   const activeTasks = useSelector(state => state.tasks.activeTasks);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       dispatch(checkAndUpdateTasks());
//     }, 60000); // كل دقيقة
//     return () => clearInterval(interval);
//   }, [dispatch]);

//   const handleAddTask = () => {
//     if (taskTitle.trim() === '') {
//       setOpenSnackbar(true); // إذا لم يتم إدخال عنوان المهمة
//       return;
//     }
//     if (multiplier >= 0) {
//       const newTask = { id: Date.now(), title: taskTitle, multiplier, createdAt: new Date().toISOString() };
//       dispatch(addTask(newTask));
//       setTaskTitle('');
//       setMultiplier(1); // إعادة تعيين قيمة الـ multiplier بعد إضافة المهمة
//     }
//   };

//   const handleArchiveTask = (taskId) => {
//     dispatch(archiveTask(taskId));
//   };

//   const handleMultiplierChange = (e) => {
//     // التأكد من أن القيمة المدخلة لا تكون سالبة
//     const value = Math.max(0, Number(e.target.value)); // تجنب القيم السالبة
//     setMultiplier(value);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);  // إغلاق Snackbar بعد فترة
//   };

//   // تأثير الأنيميشين لشريط التقدم
//   useEffect(() => {
//     if (openSnackbar) {
//       let progressInterval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev === 100) {
//             clearInterval(progressInterval);
//             setOpenSnackbar(false); // إغلاق الـ Snackbar بعد اكتمال الشريط
//           }
//           return prev + 5;
//         });
//       }, 100);
//     } else {
//       setProgress(0); // إعادة تعيين التقدم إذا تم إغلاق الـ Snackbar
//     }
//   }, [openSnackbar]);

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>To-Do List</Typography>
      
//       <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 4 }}>
//         <TextField 
//           label="Task Title" 
//           value={taskTitle} 
//           onChange={(e) => setTaskTitle(e.target.value)} 
//           fullWidth 
//         />
//         <TextField 
//           label="Multiplier" 
//           type="number" 
//           value={multiplier} 
//           onChange={handleMultiplierChange} 
//           fullWidth 
//         />
//         <Button onClick={handleAddTask} variant="contained" sx={{ height: '100%' }}>Add Task</Button>
//       </Box>

//       <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
//         {activeTasks.map((task) => (
//           <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
//             <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{task.title}</Typography>
//               <Typography variant="body2" sx={{ mb: 2 }}>Repeats every {task.multiplier} days</Typography>
//               <Button variant="contained" color="error" fullWidth onClick={() => handleArchiveTask(task.id)}>
//                 Archive
//               </Button>
//             </Card>
//           </motion.div>
//         ))}
//       </Box>

//       <Snackbar
//         open={openSnackbar}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         TransitionComponent="slide"      >
//         <Alert
//           severity="error"
//           sx={{
//             backgroundColor: 'white',
//             color: 'red',
//             padding: '10px 20px',
//             boxShadow: 2,
//             borderRadius: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: 300,
//             '& .MuiAlert-message': {
//               flexGrow: 1,
//             },
//           }}
//           action={
//             <CloseIcon
//               onClick={handleCloseSnackbar}
//               sx={{ cursor: 'pointer', color: 'red' }}
//             />
//           }
//         >
//           Please enter a task title!
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default TaskListPage;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, TextField, Card, Typography, Box, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { addTask, archiveTask, checkAndUpdateTasks, deleteTask } from '../redux/tasksSlice';
import { motion } from 'framer-motion';

const TaskListPage = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);  
  const [setProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const dispatch = useDispatch();
  const activeTasks = useSelector(state => state.tasks.activeTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkAndUpdateTasks());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleAddTask = () => {
    if (taskTitle.trim() === '') {
      setOpenSnackbar(true);
      return;
    }
    if (multiplier >= 0) {
      const newTask = { id: Date.now(), title: taskTitle, multiplier, createdAt: new Date().toISOString() };
      dispatch(addTask(newTask));
      setTaskTitle('');
      setMultiplier(1);
    }
  };

  const handleArchiveTask = (taskId) => {
    dispatch(archiveTask(taskId));
  };

  const handleOpenDeleteDialog = (taskId) => {
    setSelectedTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTask(selectedTaskId));
    setDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleMultiplierChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setMultiplier(value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (openSnackbar) {
      let progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev === 100) {
            clearInterval(progressInterval);
            setOpenSnackbar(false);
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setProgress(0);
    }
  }, [openSnackbar]);

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>To-Do List</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 4 }}>
        <TextField label="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} fullWidth />
        <TextField label="Multiplier" type="number" value={multiplier} onChange={handleMultiplierChange} fullWidth />
        <Button onClick={handleAddTask} variant="contained" sx={{ height: '100%' }}>Add Task</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
        {activeTasks.map((task) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{task.title}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Repeats every {task.multiplier} days</Typography>
              <Button variant="contained" color="success" fullWidth onClick={() => handleArchiveTask(task.id)}>Archive</Button>
              <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={() => handleOpenDeleteDialog(task.id)} startIcon={<DeleteIcon />}>Delete</Button>
            </Card>
          </motion.div>
        ))}
      </Box>

      <Snackbar open={openSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          severity="error"
          sx={{
            backgroundColor: 'white',
            color: 'red',
            padding: '10px 20px',
            boxShadow: 2,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 300,
            '& .MuiAlert-message': { flexGrow: 1 },
          }}
          action={<CloseIcon onClick={handleCloseSnackbar} sx={{ cursor: 'pointer', color: 'red' }} />}
        >
          Please enter a task title!
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskListPage;
