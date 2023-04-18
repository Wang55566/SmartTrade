import React from "react";
import { useHistory } from 'react-router-dom';
import * as listActions from '../../store/lists';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as taskActions from '../../store/tasks';
import * as searchActions from '../../store/search';

function DeleteModal({ query, listId, action, taskId, setTD }) {
  const history = useHistory()
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (action == 'list') {
      await dispatch(listActions.deleteList(listId))
      await dispatch(taskActions.allTasks())
      history.push('/app/all')
    }

    else {
      setTD(false)
      await dispatch(taskActions.deleteTask(taskId))

      if ( action === 'deleteTaskList') {
        await dispatch(listActions.singleList(listId))
      }
      else if ( action === 'deleteTaskSearch') {
        await dispatch(searchActions.allSearch(query))
      }
    }

    closeModal()
  };

  return (
    <div className="pad-tb-10p pad-lr-150rem">
        {action === 'list' ? <h2>Remove List</h2> : <h2>Remove Task</h2>}
        <p>Are you sure you wish to remove {action === 'list' ? 'list' : 'task'}?</p>
        <button onClick={handleSubmit}
          className="bg-blue-dff color-white border-0 pad-lr-150rem pad-tb-10p mrg-r-8p borderR-5p">
          Yes, remove {action === 'list' ? 'list' : 'task'}
        </button>
        <button
        onClick={closeModal}
        className="border-0 color-blue-dff-hover pad-lr-150rem pad-tb-10p borderR-5p">
          No
        </button>
    </div>
  );
}

export default DeleteModal
