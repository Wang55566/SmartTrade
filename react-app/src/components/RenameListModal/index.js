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
    if(listName !=='' && listName.length < 14) {
      const name = listName;
      const id = watchlist.id;
      await dispatch(watchlistActions.updateOneList(name, id));
      await dispatch(watchlistActions.getAllLists());
      closeModal();
    } else {
      alert('Please enter a watchlist name with 1-13 characters')
    }
  }


  return (
    <div className='rename-watchlist'>
      <h3 className='rename-title'>
        Rename your watchlist "{watchlist.name}"?
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
      <div className='rename-watchlist-buttons'>
        <button type="submit" className='rename-save'>Save</button>
        <button className='rename-cancel' onClick={onClickCancel}>Cancel</button>
      </div>
      </form>
    </div>
  )
}

export default RenameListModal;
