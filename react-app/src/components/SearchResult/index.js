import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';


function SearchResult() {

  const { symbol } = useParams();

  const [average_cost, setAverageCost] = useState(0);
  const [market_price, setMarketPrice] = useState(0);
  const [shares, setShares] = useState(0);


  const [inputShares, setInputShares] = useState('');

  const [transaction_buy, setTransactionBuy] = useState(true);

  const assets = useSelector(state => state.asset.allAssets);
  const user = useSelector(state => state.session.user);
  const result = useSelector(state => state.search.resultdetails);
  const singleAsset = useSelector(state => state.asset.singleAsset);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(assetActions.getAll())
    Object.values(assets).forEach( asset => {
      if (asset.symbol === symbol) {
        dispatch(assetActions.getOne(asset.id))
        setAverageCost(asset.average_cost)
        setMarketPrice(asset.market_price)
        setShares(asset.shares)
      }
    })

  }, [dispatch, symbol])


  const handleSubmit = async (e) => {

    // Update the asset
    if(Object.values(singleAsset).length !== 0) {

      console.log('Updating asset')

      e.preventDefault();

      if (transaction_buy === true) {
        console.log('update buying')
        const product = singleAsset.average_cost * singleAsset.shares;
        const new_shares = singleAsset.shares + parseInt(inputShares);
        const new_average_cost = ((product + (singleAsset.market_price * parseInt(inputShares))) / new_shares).toFixed(2);
        await dispatch(assetActions.update({ shares: new_shares, average_cost: new_average_cost, id: singleAsset.id }));
        await setShares(new_shares)
        await setAverageCost(new_average_cost)
      }
      else {

        if(singleAsset.shares < parseInt(inputShares)) {
          alert('You cannot sell more shares than you own')
          return
        } else if(singleAsset.shares === parseInt(inputShares)) {
          console.log('update removing')
          await dispatch(assetActions.remove(singleAsset.id));
          await setShares(0)
          await setAverageCost(0)
        } else {
          console.log('update selling')
          const new_shares = singleAsset.shares - parseInt(inputShares);
          await dispatch(assetActions.update({ shares: new_shares, average_cost: singleAsset.average_cost, id: singleAsset.id }));
          await setShares(new_shares)
        }
      }
    }

    // Create a new asset
    else {
      if (transaction_buy === true) {
        console.log('creating asset')
        const newAsset = {
          symbol: symbol,
          shares: parseInt(inputShares)
        }
        await dispatch(assetActions.create(newAsset));
        await dispatch(assetActions.getAll())
      }
      else {
        alert('You cannot sell shares you do not own')
        return
      }
    }
  }


  return (
    <>
      <div>

        <div className='asset-summary'>
          <div>Symbol: {symbol}</div>
          <div>Average Cost: {average_cost}</div>
          <div>Market Price: {market_price}</div>
          <div>Shares: {shares}</div>
        </div>

        <div>
          <button onClick={(e) => setTransactionBuy(!transaction_buy)}>{transaction_buy === true ? "Switch to sell" : "Switch to Buy"}</button>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <label>Shares</label>
            <input
              type="number"
              value={inputShares}
              onChange={(e) => setInputShares(e.target.value)}
              required
            />
            <button type="submit">{transaction_buy === true ? "Buy" : "Sell"}</button>
          </form>
        </div>
        <div>
          Buying Power: {user?.available_cash}
        </div>
      </div>
    </>
  )
}

export default SearchResult
