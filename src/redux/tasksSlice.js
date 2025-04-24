import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('tasks'));

const initialState = saved || {
  activeTasks: [],
  archivedTasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const task = action.payload;
      state.activeTasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(state));
    },
    archiveTask: (state, action) => {
      const taskId = action.payload;
      const taskIndex = state.activeTasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        const [task] = state.activeTasks.splice(taskIndex, 1);
        state.archivedTasks.push({ ...task, archivedAt: new Date().toISOString() });
        localStorage.setItem('tasks', JSON.stringify(state));
      }
    },
    restoreTask: (state, action) => {
      const taskId = action.payload;
      const taskIndex = state.archivedTasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        const [task] = state.archivedTasks.splice(taskIndex, 1);
        state.activeTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(state));
      }
    },deleteTask: (state, action) => {
      const taskId = action.payload;
      state.activeTasks = state.activeTasks.filter(task => task.id !== taskId);
      state.archivedTasks = state.archivedTasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(state));
    },
    
    // checkAndUpdateTasks: (state) => {
    //   const now = new Date();
    //   state.archivedTasks.forEach((task) => {
    //     const archivedAt = new Date(task.archivedAt);
    //     const daysPassed = Math.floor((now - archivedAt) / (1000 * 60 * 60 * 24));
    //     if (daysPassed >= task.multiplier) {
    //       if (daysPassed > task.multiplier) {
    //         state.activeTasks.push(task);
    //       } else {
    //         const newTask = { ...task, multiplier: task.multiplier * 2 };
    //         state.archivedTasks.push(newTask);
    //       }
    //       localStorage.setItem('tasks', JSON.stringify(state));
    //     }
    //   });
    // }
    checkAndUpdateTasks: (state) => {
      const now = new Date();
      const updatedArchived = [];
      
      state.archivedTasks.forEach((task) => {
        const archivedAt = new Date(task.archivedAt);
        const hoursPassed = Math.floor((now - archivedAt) / (1000 * 60 * 60)); // كم ساعة مرت
        const targetHours = task.multiplier * 24; // عدد الساعات المحددة للمهمة
    
        const remainingHours = Math.max(targetHours - hoursPassed, 0); // الوقت المتبقي للمهمة
    
        if (hoursPassed >= targetHours) {
          // لو الوقت انتهى، نضيفه للـ activeTasks فقط لو مش موجود هناك
          const alreadyExists = state.activeTasks.some(t => t.id === task.id);
          if (!alreadyExists) {
            state.activeTasks.push({ ...task });
            // حذف المهمة من archivedTasks بعد نقلها
            state.archivedTasks = state.archivedTasks.filter(t => t.id !== task.id);
          }
        } else {
          // لو المدة لسه مخلصتش، نحدث قائمة الـ archivedTasks لعرض الوقت المتبقي
          updatedArchived.push({ ...task, remainingTime: remainingHours });
        }
      });
    
      state.archivedTasks = updatedArchived; // تحديث الـ archivedTasks
      localStorage.setItem('tasks', JSON.stringify(state)); // حفظ الحالة في الـ localStorage
    }
    
    
  }
});

export const { addTask, archiveTask, restoreTask, checkAndUpdateTasks ,deleteTask} = tasksSlice.actions;

export default tasksSlice.reducer;
