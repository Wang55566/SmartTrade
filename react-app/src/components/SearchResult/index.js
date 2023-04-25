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

  let quoted_price = result?.[Object.keys(result)[0]]?.['05. price'];
  let quoted_price_to_fixed = parseFloat(quoted_price).toFixed(2);
  let estimated = (quoted_price_to_fixed * inputShares).toFixed(2);
  let market_value = (shares * quoted_price_to_fixed).toFixed(2);

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

    // Validate input
    let inputSharesNumber = Number(inputShares)
    if(inputSharesNumber < 1 || !Number.isInteger(inputSharesNumber)) {
      alert('Please enter a positive integer')
      return;
    }

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
        await setAverageCost(quoted_price_to_fixed)
        await setShares(parseInt(inputShares))
        await setMarketPrice(quoted_price_to_fixed)
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
            <div>{result?.[Object.keys(result)[0]]?.['01. symbol']}</div>
            <div>$ {quoted_price_to_fixed}</div>
          </div>

          <div>
            <img src={stock_chart} alt='stock chart' />
          </div>

          <div className='asset-stock-details'>
            {Object.values(singleAsset).length !== 0 ?
              <>
                <div className='asset-left'>
                  <div>Your market value</div>
                  <div className='bold-price'>${market_value}</div>
                </div>
                <div className='asset-right'>
                  <div>Your average cost</div>
                  <div className='bold-price'>${average_cost}</div>
                  <div>shares</div>
                  <div className='bold-price'>{shares}</div>
                </div>
              </>
            :
              <>
                <div className='asset-none'></div>
              </>
            }
          </div>

        </div>

        <div className='trade-panel'>

          <div className='transaction-switch'>
            <button onClick={(e) => setTransactionBuy(!transaction_buy)}>{transaction_buy === true ? "Switch to sell" : "Switch to Buy"}</button>
          </div>

          <div className='transaction-form'>
            <form onSubmit={handleSubmit}>
              <div className='transaction-market-price'>Market Price: {quoted_price_to_fixed}</div>
              <div className='share-input'>
                <label className='transaction-label'>Shares</label>
                <input
                  type="number"
                  value={inputShares}
                  onChange={(e) => setInputShares(e.target.value)}
                  required
                  className='transaction-input-box'
                />
              </div>
              <div className='transaction-estimated-cost'>Estimated Cost: {estimated}</div>
              <button type="submit" className='transaction-button'>{transaction_buy === true ? "Buy" : "Sell"}</button>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default SearchResult
