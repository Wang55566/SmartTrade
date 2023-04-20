import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as assetActions from '../../store/asset';

function Assets() {

  const dispatch = useDispatch();

  const assets = useSelector(state => state.asset.allAssets);

  useEffect(() => {
    dispatch(assetActions.getAll());
  }, [dispatch]);

  return (
    <>
      <h1>Assets</h1>
      <div>
        {Object.values(assets).map(asset => (
          <NavLink to={`/assets/${asset.id}`} key={asset.id} onClick={()=> dispatch(assetActions.getOne(asset.id))}>
          <ul>
            <li>Symbol: {asset.symbol}</li>
            <li>Market_price: {asset.market_price}</li>
          </ul>
          </NavLink>
        ))}
      </div>

    </>
  )
}
export default Assets
