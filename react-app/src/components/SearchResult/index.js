import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';

function SearchResult() {

  const { symbol } = useParams();

  const [average_cost, setAverageCost] = useState('');
  const [market_price, setMarketPrice] = useState('');
  const [shares, setShares] = useState('');
  const [assetId, setAssetId] = useState('');

  const [inputShares, setInputShares] = useState('');

  const [transaction_buy, setTransactionBuy] = useState(true);

  const assets = useSelector(state => state.asset.allAssets);
  const user = useSelector(state => state.session.user);
  const result = useSelector(state => state.search.resultdetails);
  const singleAsset = useSelector(state => state.asset.singleAsset);

  const dispatch = useDispatch();
  const history = useHistory();

  // }, [dispatch, symbol])

  // useEffect(() => {

  //     dispatch(assetActions.getAll())
  //     dispatch(searchActions.clearSearch())
  //     .then(() => {
  //       Object.values(assets).forEach( asset => {
  //         if (asset.symbol === symbol) {
  //           // console.log('single asset', asset)
  //           dispatch(assetActions.getOne(asset.id))
  //           setAverageCost(asset.average_cost)
  //           setMarketPrice(asset.market_price)
  //           setShares(asset.shares)
  //         }
  //       })
  //     })
  //     .then (() => {
  //       dispatch(searchActions.getResultDetails(symbol))
  //     })
  //     .then(() => {
  //       if(Object.values(singleAsset).length === 0 ) {
  //         // console.log('no single asset')
  //         // setAverageCost('')
  //         // setMarketPrice('')
  //         // setShares('')
  //       }
  //     })

  // }, [dispatch, symbol, shares])

  useEffect(() => {
    dispatch(assetActions.getAll())
  }, [dispatch])

  useEffect(() => {
    Object.values(assets)?.forEach( asset => {
      if (asset?.symbol === symbol) {
        setAverageCost(asset.average_cost)
        setMarketPrice(asset.market_price)
        setShares(asset.shares)
        setAssetId(asset.id)
    }})
  }, [assets]);

  useEffect(() => {
    // console.log('asset id', assetId)
    if(assetId) {
      dispatch(assetActions?.getOne?.(assetId))
    }

    dispatch(searchActions.getResultDetails(symbol))
  }, [assetId])



  const handleSubmit = async (e) => {

    e.preventDefault();

    // Update the asset
    if(Object.values(singleAsset).length !== 0) {

      console.log('Updating asset')

      if (transaction_buy === true) {

        console.log('update buying')
        const product = singleAsset.average_cost * singleAsset.shares;
        const new_shares = singleAsset.shares + parseInt(inputShares);
        const new_average_cost = ((product + (singleAsset.market_price * parseInt(inputShares))) / new_shares).toFixed(2);
        await dispatch(assetActions.update({ shares: new_shares, average_cost: new_average_cost, id: singleAsset.id }));
        await setShares(new_shares)
        await setAverageCost(new_average_cost)
        await setInputShares('')
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
        await setInputShares('')
      } else {
        console.log('update selling')
        const new_shares = singleAsset.shares - parseInt(inputShares);
        await dispatch(assetActions.update({ shares: new_shares, average_cost: singleAsset.average_cost, id: singleAsset.id }));
        await setShares(new_shares)
        await setInputShares('')
      }
    }
  }

    // Create a new asset
    else {
      if (transaction_buy === true) {

          const newAsset = {
          symbol: symbol,
          shares: parseInt(inputShares)
        }
        await dispatch(assetActions.create(newAsset));
        await setInputShares('')
        await setAverageCost(result?.[Object.keys(result)[0]]?.['05. price'])
        await setShares(parseInt(inputShares))
        await setMarketPrice(result?.[Object.keys(result)[0]]?.['05. price'])
      }
      else {
        alert('You cannot sell shares you do not own')
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

        <div className='result-detail'>
          <div>Global Quote Price: {result?.[Object.keys(result)[0]]?.['05. price']}</div>
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
