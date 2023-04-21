import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';

import * as assetActions from '../../store/asset';

function SingleAsset() {

  const dispatch = useDispatch();
  const { id } = useParams();

  const [shares, setShares] = useState('');
  const [transaction_buy, setTransactionBuy] = useState(true);

  const asset = useSelector(state => state.asset.singleAsset);
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(assetActions.getOne(id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (transaction_buy === true) {
      const product = asset.average_cost * asset.shares;
      const new_shares = parseInt(shares) + asset.shares;
      const new_average_cost = ((product + (asset.market_price * shares)) / new_shares).toFixed(2);
      await dispatch(assetActions.update({ shares: new_shares, average_cost: new_average_cost, id: asset.id }));
    }
    else {
      if(asset.shares < shares) {
        alert('You cannot sell more shares than you own')
        return
      } else if(asset.shares === shares) {
        await dispatch(assetActions.remove(asset.id));
      } else {
        const new_shares = asset.shares - parseInt(shares);
        await dispatch(assetActions.update({ shares: new_shares, average_cost: asset.average_cost, id: asset.id }));
      }
    }
  }

  return (
    <>
      <div>Symbol: {asset.symbol}</div>
      <div>Average Cost: {asset.average_cost}</div>
      <div>Market Price: {asset.market_price}</div>
      <div>Shares: {asset.shares}</div>
      <div>
        <button onClick={(e) => setTransactionBuy(!transaction_buy)}>{transaction_buy === true ? "Switch to sell" : "Switch to Buy"}</button>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Shares</label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            required
          />
          <button type="submit">{transaction_buy === true ? "Buy" : "Sell"}</button>
        </form>
      </div>
      <div>
        Buying Power: {user?.available_cash}
      </div>
    </>
  )
}
export default SingleAsset
