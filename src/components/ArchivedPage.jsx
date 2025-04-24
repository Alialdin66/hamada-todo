// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Card, Typography, Box } from '@mui/material';
// import { restoreTask } from '../redux/tasksSlice';
// import { motion } from 'framer-motion';

// const ArchivedPage = () => {
//   const dispatch = useDispatch();
//   const archivedTasks = useSelector(state => state.tasks.archivedTasks);

//   const handleRestoreTask = (taskId) => {
//     dispatch(restoreTask(taskId));
//   };

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>Archived Tasks</Typography>
      
//       <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
//         {archivedTasks.map((task) => (
//           <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
//             <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{task.title}</Typography>
//               <Typography variant="body2" sx={{ mb: 2 }}>Repeats every {task.multiplier} days</Typography>
//               <Button variant="contained" color="success" fullWidth onClick={() => handleRestoreTask(task.id)}>
//                 Restore
//               </Button>
//             </Card>
//           </motion.div>
//         ))}
//       </Box>
//     </div>
//   );
// };

// export default ArchivedPage;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Card, Typography, Box,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { restoreTask, deleteTask } from '../redux/tasksSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

const ArchivedPage = () => {
  const dispatch = useDispatch();
  const archivedTasks = useSelector(state => state.tasks.archivedTasks);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleRestoreTask = (taskId) => {
    dispatch(restoreTask(taskId));
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

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>Archived Tasks</Typography>
      
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
        {/* {archivedTasks.map((task) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{task.title}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Repeats every {task.multiplier} days</Typography>
              <Button variant="contained" color="success" fullWidth onClick={() => handleRestoreTask(task.id)}>Restore</Button>
              <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={() => handleOpenDeleteDialog(task.id)} startIcon={<DeleteIcon />}>Delete</Button>
            </Card>
          </motion.div>
        ))} */}
        {archivedTasks.map((task) => {
  const now = new Date();
  const archivedAt = new Date(task.archivedAt);
  const deadline = new Date(archivedAt.getTime() + task.multiplier * 24 * 60 * 60 * 1000);
  const remainingMs = Math.max(0, deadline - now);

  const seconds = Math.floor((remainingMs / 1000) % 60);
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

  return (
    <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{task.title}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>Repeats every {task.multiplier} days</Typography>

        <Typography variant="body2" sx={{ mb: 2, color: 'green' }}>
          ⏳ Remaining: {days}d {hours}h {minutes}m {seconds}s
        </Typography>

        <Button variant="contained" color="success" fullWidth onClick={() => handleRestoreTask(task.id)}>Restore</Button>
        <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={() => handleOpenDeleteDialog(task.id)} startIcon={<DeleteIcon />}>Delete</Button>
      </Card>
    </motion.div>
  );
})}

      </Box>

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

export default ArchivedPage;
