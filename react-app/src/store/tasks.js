//todo add task to list, create task, delete task

const SETALLTASKS = 'tasks/ALL';
const SETSINGLETASK = 'tasks/SINGLE';
const CREATETASK = 'tasks/CREATE';
const UPDATETASKNAME = 'tasks/UPDATENAME';
const UPDATETASKLIST = 'tasks/UPDATELIST';
const UPDATECOMPLETEDSTATUS = 'tasks/UPDATECOMPLETED';
const DELETETASK = 'tasks/DELETE';

const allTasks1 = (obj) => {
  return {
    type: SETALLTASKS,
    obj
  };
};

const singleTask1 = (obj) => {
  return {
    type: SETSINGLETASK,
    obj
  };
};

const createTask1 = (obj) => {
  return {
    type: CREATETASK,
    obj
  };
};

const renameTask1 = (obj) => {
  return {
    type: UPDATETASKNAME,
    obj
  };
};

const updateCompleteStatus1 = (obj) => {
  return {
    type: UPDATECOMPLETEDSTATUS,
    obj
  };
};

const updateTaskList1 = (obj) => {
  return {
    type: UPDATETASKLIST,
    obj
  };
};

const deleteTask1 = (obj) => {
  return {
    type: DELETETASK,
    obj
  };
};


// thunk
export const allTasks = () => async (dispatch) => {
  const response = await fetch(`/api/tasks/all`)
  if (response.ok) {
    const data = await response.json();
    dispatch(allTasks1(data));
  };
  return response
};

export const singleTask = (taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}`)
  if (response.ok) {
    const data = await response.json();
    dispatch(singleTask1(data));
  };
  return response
};

export const createTask = (formData) => async (dispatch) => {
  const response = await fetch(`/api/tasks`, {
    method: 'POST',
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(createTask1(data));
    dispatch(singleTask1(data.id))
  };
  return response
};

export const renameTask = (taskId, formData) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(renameTask1(data));
    dispatch(singleTask1(taskId))
  };
  return response
};

export const updateTaskList = (taskId, formData) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}/list`, {
    method: 'PUT',
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(updateTaskList1(data));
    dispatch(singleTask1(taskId))
  };
  return response
};

export const changeCompleteStatus = (taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}/completed`, {
    method: 'PUT'
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(updateCompleteStatus1(data));
    dispatch(singleTask1(taskId))
  };
  return response
};

export const deleteTask = (taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteTask1(data));
  };
  return response
};


const initialState = {
  allTasks: {},
  singleTask: {},
  numCompleted: 0,
  numNotCompleted: 0
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETALLTASKS:
      let newState1 = { singleTask: { ...state.allTasks }, allTasks: {} };
      action.obj.tasks.forEach(s => newState1.allTasks[s.id] = s);
      newState1.numCompleted = action.obj.numCompleted
      newState1.numNotCompleted = action.obj.numNotCompleted
      return newState1;
    case SETSINGLETASK:
      // we do not know if task.list will copy or not... if problems arise we can adjust
      let newState2 = { ...state, allTasks: { ...state.allTasks }, singleTask: {} };
      newState2.singleTask = { ...action.obj };
      return newState2;
    case UPDATETASKNAME:
      let newState3 = { ...state, allTasks: { ...state.allTasks }, singleTask: {} };
      let task1 = action.obj
      newState3.allTasks[task1.id] = { ...task1 };
      return newState3
    case UPDATECOMPLETEDSTATUS:
      let newState4 = {...state, allTasks: { ...state.allTasks }, singleTask: {} };
      let task2 = action.obj
      if (task2.completed) {
        newState4.numCompleted += 1
        newState4.numNotCompleted -= 1
      }
      else {
        newState4.numCompleted -= 1
        newState4.numNotCompleted += 1
      }
      newState4.allTasks[task2.id] = { ...task2 };
      return newState4
    case UPDATETASKLIST:
      let newState5 = {...state, allTasks: { ...state.allTasks }, singleTask: {} };
      let task3 = action.obj
      newState5.allTasks[task3.id] = { ...task3 };
      return newState5
    case CREATETASK:
      let newState6 = {...state, allTasks: { ...state.allTasks }, singleTask: {} };
      newState6.numNotCompleted += 1
      let task4 = action.obj
      newState6.allTasks[task4.id] = { ...task4 };
      return newState6
    case DELETETASK:
      let newState7 = {...state, allTasks: { ...state.allTasks }, singleTask: {...state.singleTask} };
      let task5 = action.obj
      if (task5.completed) newState7.numCompleted -= 1
      else newState7.numNotCompleted -= 1
      delete newState7.allTasks[task5.id]
      if (newState7.singleTask.id == task5.id) newState7.singleTask = {}
      return newState7
    default:
      return state;
  }
};

export default tasksReducer;
