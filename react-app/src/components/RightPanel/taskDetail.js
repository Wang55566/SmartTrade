import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as taskActions from '../../store/tasks'
import * as listActions from '../../store/lists';
import * as searchActions from '../../store/search';
import './taskDetail.css'

function TaskDetail({ query, currTaskId, setTD }) {
  let dispatch = useDispatch()
  let task = useSelector(state => state.tasks.singleTask)
  let lists = Object.values(useSelector(state => state.lists.allLists))
  let list = lists.find(l => l.id == task.list_id)
  const [inputValue, setInputValue] = useState(task.name);

  useEffect(() => {
    dispatch(taskActions.singleTask(currTaskId))
    dispatch(listActions.allLists())
  }, [dispatch])

  useEffect(() => {
    if (task) {
      setInputValue(task.name);
    }
  }, [task]);

  const handleInputChange = async (event) => {
    await setInputValue(event.target.value)
  };

  const handleOnBlur = async (event) => {
    await dispatch(taskActions.renameTask(currTaskId, { name: event.target.value }))
    await dispatch(taskActions.singleTask(currTaskId))
    if (list) await dispatch(listActions.singleList(list.id))
    if (query) await dispatch(searchActions.allSearch(query))
  }

  const handleListChange = async (e) => {
    if (e.target.value == 'Inbox') await dispatch(taskActions.updateTaskList(task.id, {listId: null}))
    else await dispatch(taskActions.updateTaskList(task.id, {listId: e.target.value}))
    if (list) await dispatch(listActions.singleList(list.id))
    setTD(false)
  }

  if(!task) return null

  return (
    <div
    className="main">
      <h1
      className="name">
      {task.name}</h1>
      <div
      className="tooltip">
        <span
        className="tooltiptext">
        Change Name</span>
        <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleOnBlur} />
      </div>
      <div
      className="tooltip changeTask">
        <span
        className="tooltiptext">
        Change List</span>
        {list?.name || 'Inbox'}
        {' '}
        <select
        onChange={handleListChange}>
          <option></option>
          <option value={undefined}>Inbox</option>
          {lists.map(l => (
          <option value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default TaskDetail;
