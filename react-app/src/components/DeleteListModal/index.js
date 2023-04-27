import {useModal} from '../../context/Modal';
import { useDispatch } from "react-redux";

import * as watchlistActions from "../../store/watchlist";

import './DeleteListModal.css';

function DeleteListModal({ watchlist }) {

  const dispatch = useDispatch();

  const {closeModal} = useModal();

  const onClickNo = async () => {
    closeModal();
  }

  const onClickYes = async () => {
    await dispatch(watchlistActions.deleteOneList(watchlist.id));
    await dispatch(watchlistActions.getAllLists());
    closeModal();
  }

  return (
    <div className='delete-watchlist'>
      <h3>
        Are you sure you want to delete "{watchlist.name}"?
      </h3>
      <h4>
        If you delete this list, it will be gone forever!
      </h4>
      <div className='buttons'>
        <button className='delete-yes' onClick={onClickYes}>Confirm</button>
        <button className='delete-no' onClick={onClickNo}>Cancel</button>
      </div>
    </div>
  )
}

export default DeleteListModal;
