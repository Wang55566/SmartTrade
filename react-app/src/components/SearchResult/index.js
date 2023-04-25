import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';

import stock_chart from '../../stock chart.png'

import './SearchResult.css'

function SearchResult() {

  const { symbol } = useParams();

  const [average_cost, setAverageCost] = useState('');
  const [market_price, setMarketPrice] = useState('');
  const [shares, setShares] = useState('');
  const [assetId, setAssetId] = useState('');

  const [inputShares, setInputShares] = useState('');

  const [transaction_buy, setTransactionBuy] = useState(true);

  const assets = useSelector(state => state.asset.allAssets);
  const result = useSelector(state => state.search.resultdetails);
  const singleAsset = useSelector(state => state.asset.singleAsset);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('------------first use effect------------')
    dispatch(searchActions.clearSearch())
    dispatch(assetActions.getAll())
  }, [dispatch])

  useEffect(() => {
    console.log('------------second use effect------------')
    dispatch(searchActions.getResultDetails(symbol))
    setAssetId('')
    Object.values(assets).forEach( asset => {
      if (asset.symbol === symbol) {
        setAverageCost(asset.average_cost)
        setMarketPrice(asset.market_price)
        setShares(asset.shares)
        setAssetId(asset.id)
    }})
  }, [assets, symbol]);

  useEffect(() => {
    console.log('------------third use effect------------')
    if(assetId) {
      dispatch(assetActions?.getOne?.(assetId))
    } else {
      setAverageCost('')
      setMarketPrice('')
      setShares('')
    }

  }, [dispatch, assetId])



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
      <div className='single-stock-details'>

        <div className='left-panel'>

          <div className='result-detail'>
            <div>{result[Object.keys(result)[0]]['01. symbol']}</div>
            <div>$ {result[Object.keys(result)[0]]['05. price']}</div>
          </div>

          <div>
            <img src={stock_chart} alt='stock chart' />
          </div>

          <div>Average Cost: {average_cost}</div>
          <div>Shares: {shares}</div>

        </div>

        <div className='trade-panel'>

          <div className='transaction-switch'>
            <button onClick={(e) => setTransactionBuy(!transaction_buy)}>{transaction_buy === true ? "Switch to sell" : "Switch to Buy"}</button>
          </div>

          <div className='asset-summary'>
            <div>Market Price: {market_price}</div>
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

        </div>
      </div>
    </>
  )
}

export default SearchResult
