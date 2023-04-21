import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as assetActions from '../../store/asset';

import './Assets.css';

function Assets() {

  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);
  const assets = useSelector(state => state.asset.allAssets);

  useEffect(() => {
    dispatch(assetActions.getAll());
  }, [dispatch]);

  return (
    <>
      <div className="all-asset">
        {Object.values(assets).map(asset => (
          <NavLink
            to={`/assets/${asset.id}`}
            key={asset.id}
            className="asset-link"
          >
          <div className="one-asset">
            <div>Symbol: {asset.symbol}</div>
            <div>Market_price: {asset.market_price}</div>
          </div>
          </NavLink>
        ))}
      </div>
      <div>
        Buying Power: {user?.available_cash}
      </div>
    </>
  )
}
export default Assets
