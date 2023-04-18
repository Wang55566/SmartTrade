import React, { useState } from "react";
import * as listActions from '../../store/lists';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

function ListModal({ action, listId }) {
  const dispatch = useDispatch();
  const [listName, setListName] = useState("");
  const { closeModal } = useModal();
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();
    if(action == "create") {
      return dispatch(listActions.createlist(
        { name: listName }
      ))
        .then(closeModal)
        .then(history.push('/app/all'))
    }

    else if(action=="rename") {
      return dispatch(listActions.renameList(listId, { name: listName }))
      .then(closeModal)
      .then(history.push('/app/all'))
    }

  };

  return (
    <div className='new-list-form pad-tb-10p pad-lr-150rem'>
      {action == "create" ? <h1>Add a List</h1> : <h1>Rename List</h1>}
      <form onSubmit={handleSubmit}
        className="flx-col">
        {action == "create" ? (<label>
          <div>
            Please enter a new list name:
          </div>
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
          />
        </label>) :
          (<label>
            List name:
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
            />
          </label>)
        }

        <div className="pad-tb-10p">
          <button type="submit"
            className="bg-blue-dff color-white border-0 pad-lr-150rem pad-tb-10p mrg-r-8p borderR-5p">
              {action == "create" ? "Add" : "Save"}
          </button>
          <button onClick={closeModal}
            className="border-0 color-blue-dff-hover pad-lr-150rem pad-tb-10p borderR-5p">
              Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ListModal;
