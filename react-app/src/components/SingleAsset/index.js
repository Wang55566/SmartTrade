import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as assetActions from '../../store/asset';

function SingleAsset({id}) {

  const dispatch = useDispatch();

  const asset = useSelector(state => state.asset.single);

  useEffect(() => {
    dispatch(assetActions.getOne(id));
  }, [dispatch]);

  return (
    <>
      <h1>Assets</h1>
    </>
  )
}
export default SingleAsset
