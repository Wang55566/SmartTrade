import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as assetActions from '../../store/asset';
import * as searchActions from '../../store/search';
import * as watchlistActions from '../../store/watchlist';

import './Assets.css';

import chart from '../../Chart.png'

function Assets() {

  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);
  const assets = useSelector(state => state.asset.allAssets);
  const watchlists = useSelector(state => state.watchlist.allLists);

  const [createList, setCreateList] = useState(false);

  let totalValue = 0;
  let stockValue = Object.values(assets)?.forEach(asset => {
    totalValue += (asset?.market_price * asset?.shares)
  })


  useEffect(() => {
    dispatch(assetActions.getAll());
    dispatch(watchlistActions.getAllLists());
  }, [dispatch]);

  return (
    <>
      <div className="main-page">

        <div className='middle'>

          <div className="total-value">
            $ {totalValue+user?.available_cash}
          </div>

          <div className="chart">
            <img src={chart} alt="chart" />
          </div>

          <div className="cash">
            <div className='cash-text'>Buying Power</div>
            <div className='cash-number'>${user?.available_cash}</div>
          </div>

        </div>

        <div className='right'>

          <div className="all-asset">
            <h3>Stocks</h3>
            {Object.values(assets).map(asset => (
              <NavLink
              to={`/search/${asset.symbol}`}
              key={asset.id}
              className="asset-link"
              onClick={() => (dispatch(searchActions.clearSearch()))}
              >
              <div className="one-asset">
                <div className='symbol-shares'>
                  <div className='asset-symbol'>{asset.symbol}</div>
                  <div>{asset.shares} Shares</div>
                </div>
                <div>${asset.market_price}</div>
              </div>
              </NavLink>
            ))}
          </div>

          <div className="all-watchlist">

            <div className='create-header'>
              <h3>Lists</h3>
              <div className='create-watchlist'>
                <button onClick={() => setCreateList(true)}><i className="fas fa-plus"></i></button>
              </div>
            </div>

            {/* <div className="create-list-form">
            </div> */}

            {Object.values(watchlists).map(watchlist => (
              <div key={watchlist.id} className="one-watchlist">
                {watchlist.name}
              </div>
            ))}

          </div>

        </div>

      </div>
    </>
  )
}
export default Assets
