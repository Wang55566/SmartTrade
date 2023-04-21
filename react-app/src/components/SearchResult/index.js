import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';


function SearchResult() {

  const { symbol } = useParams();

  const [shares, setShares] = useState();
  const [transaction_buy, setTransactionBuy] = useState(true);

  const user = useSelector(state => state.session.user);
  const result = useSelector(state => state.search.resultdetails);
  const assets = useSelector(state => state.asset.allAssets);
  const singleAsset = useSelector(state => state.asset.singleAsset);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(assetActions.getAll())

    Object.values(assets)?.forEach( asset => {
      if (asset?.symbol === symbol) {
        dispatch(assetActions.getOne(asset.id))
      }
    })

    // dispatch(searchActions.getResultDetails(symbol))

  }, [dispatch, symbol])

  const handleSubmit = async (e) => {

    e.preventDefault();
    const newAsset = {
      symbol: symbol,
      shares: shares
    }
    await dispatch(assetActions.create(newAsset));
    await dispatch(assetActions.getAll());
    history.push('/main');
  }


  return (
    <>
      <div>

        <div className='asset-summary'>
          <div>Symbol: {singleAsset?.symbol}</div>
          <div>Average Cost: {singleAsset?.average_cost}</div>
          <div>Market Price: {singleAsset?.market_price}</div>
          <div>Shares: {singleAsset?.shares}</div>
        </div>

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
      </div>
    </>
  )
}

export default SearchResult
