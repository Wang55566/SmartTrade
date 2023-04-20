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
          <NavLink to={`/assets/${asset.id}`} key={asset.id}>
          <ul>
            <li>{asset.symbol}</li>
            <li>{asset.market_price}</li>
            <li>{asset.average_cost}</li>
            <li>{asset.shares}</li>
          </ul>
          </NavLink>
        ))}
      </div>

    </>
  )
}
export default Assets
