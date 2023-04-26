import {useModal} from '../../context/Modal';
import { useDispatch } from "react-redux";

import * as watchlistActions from "../../store/watchlist";

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
      <h2>
        Are you sure you want to delete "{watchlist.name}"?
      </h2>
      <h3>
        If you delete this list, it will be gone forever!
      </h3>
      <button className='delete-yes' onClick={onClickYes}>Yes</button>
      <button className='delete-no' onClick={onClickNo}>No</button>
    </div>
  )
}

export default DeleteListModal;
