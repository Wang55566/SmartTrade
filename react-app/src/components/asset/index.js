import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import * as assetActions from '../../store/asset';

function Assets() {

  const dispatch = useDispatch();

  const assets = useSelector(state => state.asset.allAssets);

  useEffect(() => {
    dispatch(assetActions.getAll());
  }, [dispatch]);

  return (
    <div>
      <h1>Assets</h1>
    </div>
  );
}

export default Assets;
