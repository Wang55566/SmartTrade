import React, { useState } from 'react';
import {useModal} from '../../context/Modal';
import { useDispatch } from "react-redux";

import './RenameListModal.css';

import * as watchlistActions from "../../store/watchlist";

function RenameListModal({ watchlist }) {

  const [listName, setListName] = useState(watchlist.name);

  const dispatch = useDispatch();

  const {closeModal} = useModal();

  const onClickCancel = async () => {
    closeModal();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(listName !=='') {
      const name = listName;
      const id = watchlist.id;
      await dispatch(watchlistActions.updateOneList(name, id));
      await dispatch(watchlistActions.getAllLists());
      closeModal();
    } else {
      alert('Please enter a name for your list')
    }
  }


  return (
    <div className='rename-watchlist'>
      <h3>
        Rename you list "{watchlist.name}"?
      </h3>
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="List Name"
        className="rename-list-input"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        required
      />
      <div className='buttons'>
        <button type="submit" className='rename-save'>Save</button>
        <button className='rename-cancel' onClick={onClickCancel}>Cancel</button>
      </div>
      </form>
    </div>
  )
}

export default RenameListModal;
