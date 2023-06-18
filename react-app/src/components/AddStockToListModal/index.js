import { useState, useEffect } from "react"

import { useSelector, useDispatch } from 'react-redux';

import {useModal} from '../../context/Modal';

import * as watchlistActions from '../../store/watchlist';

import './AddStockToListModal.css'

function AddStockToListModal({symbol, quoted_price_to_fixed}) {

  const [selectedValue, setSelectedValue] = useState('initalState');

  const dispatch = useDispatch();
  const {closeModal} = useModal();

  const watchlists = useSelector(state => state.watchlist.allLists);
  const oneList = useSelector(state => state.watchlist.oneList);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(Object.values(oneList).length === 0) {
      dispatch(watchlistActions.addStockToList(symbol, quoted_price_to_fixed, selectedValue))
      dispatch(watchlistActions.getOneList(selectedValue))
    } else if(selectedValue === "") {
      dispatch(watchlistActions.removeStockFromList(symbol, oneList.id))
    } else if(selectedValue !== oneList.id) {
      dispatch(watchlistActions.moveStockFromListToList(symbol, oneList.id, selectedValue))
    }
    await dispatch(watchlistActions.getAllLists())
    closeModal();
  }

  return (
    <div className='watchlist-modal'>
      <div className='watchlist-form'>
        <h3 className="watchlist-modal-title"> Choose a watchlist or remove the stock from the watchlist</h3>
        <form onSubmit={handleSubmit}>
        {Object.values(watchlists).map((watchlist) => (
          oneList.id !== watchlist.id ? (<label key={watchlist.id}>
            <input
              type="radio"
              value={watchlist.id}
              checked={+selectedValue === watchlist.id}
              onChange={handleChange}
            />
            {watchlist.name}
          </label>): ""
        ))}
          {Object.values(oneList).length !== 0 ?<label>
            <input
              type="radio"
              value=""
              checked={selectedValue === ""}
              onChange={handleChange}
              className="remove-from-list"
            />
            Remove it from "{oneList.name}" ?
          </label>: ""}

          <div className='buttons'>
            <button type="submit" className="list-confirm">Confirm</button>
            <button onClick={closeModal} className="list-cancel">Cancel</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddStockToListModal
