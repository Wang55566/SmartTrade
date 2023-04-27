import { useState, useEffect } from "react"

import { useSelector, useDispatch } from 'react-redux';

import {useModal} from '../../context/Modal';

import * as watchlistActions from '../../store/watchlist';

import './AddStockToListModal.css'

function AddStockToListModal({symbol, quoted_price_to_fixed}) {

  const [selectedValue, setSelectedValue] = useState('');

  const dispatch = useDispatch();
  const {closeModal} = useModal();

  const watchlists = useSelector(state => state.watchlist.allLists);
  const oneList = useSelector(state => state.watchlist.oneList);

  const handleChange = async (e) => {
    await setSelectedValue(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(Object.values(oneList).length === 0) {
      await dispatch(watchlistActions.addStockToList(symbol, quoted_price_to_fixed, selectedValue))
      await dispatch(watchlistActions.getAllLists())
      await dispatch(watchlistActions.getOneList(selectedValue))
    } else if(selectedValue === "") {
      await dispatch(watchlistActions.removeStockFromList(symbol, oneList.id))
    } else if(selectedValue !== oneList.id) {
      await dispatch(watchlistActions.moveStockFromListToList(symbol, oneList.id, selectedValue))
    }
    closeModal();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
      {Object.values(watchlists).map((watchlist) => (
        <label key={watchlist.id} className="radio-label">
          <input
            type="radio"
            value={watchlist.id}
            checked={selectedValue === watchlist.id}
            onChange={handleChange}
          />
          <span className="radio-button"></span>
          {watchlist.name}
        </label>
      ))}
        <label>
          <input
            type="radio"
            value=""
            checked={selectedValue === ""}
            onChange={handleChange}
          />
          Remove from all lists
        </label>
      <button type="submit">Add to List</button>
      </form>
    </div>
  )
}

export default AddStockToListModal
