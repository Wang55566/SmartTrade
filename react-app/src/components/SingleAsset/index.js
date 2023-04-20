import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLinkm, useParams } from 'react-router-dom';

import * as assetActions from '../../store/asset';

function SingleAsset() {

  const dispatch = useDispatch();
  const { id } = useParams();

  const asset = useSelector(state => state.asset.singleAsset);

  useEffect(() => {
    dispatch(assetActions.getOne(id));
  }, [dispatch]);

  return (
    <>
      <h1>Asset</h1>
      <div>Symbol: {asset.symbol}</div>
      <div>Average Cost: {asset.average_cost}</div>
      <div>Market Price: {asset.market_price}</div>
      <div>Shares: {asset.shares}</div>
    </>
  )
}
export default SingleAsset
