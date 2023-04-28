import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as assetActions from '../../store/asset';
import * as searchActions from '../../store/search';
import * as watchlistActions from '../../store/watchlist';

import OpenModalButton from '../OpenModalButton';
import RenameListModal from '../RenameListModal';
import DeleteListModal from '../DeleteListModal';

import './Assets.css';

import chart from '../../Chart.png'

function Assets() {

  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);
  const assets = useSelector(state => state.asset.allAssets);
  const watchlists = useSelector(state => state.watchlist.allLists);
  const oneList = useSelector(state => state.watchlist.oneList);

  const [createList, setCreateList] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [oneListId, setOneListId] = useState(null);

  let totalValue = 0;
  Object.values(assets)?.forEach(asset => {
    totalValue += asset?.market_price * asset?.shares
  })


  useEffect(() => {
    dispatch(assetActions.getAll());
    dispatch(watchlistActions.getAllLists());
  }, [dispatch]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if(e.target[0].value!=='') {
      const name = e.target[0].value
      const user_id = user.id;
      await dispatch(watchlistActions.createOneList({name, user_id}));
      await dispatch(watchlistActions.getAllLists());
      setCreateList(false);
    } else {
      alert('Please enter a name for your list')
    }
  }

  const handleOpenOneList = async(id) => {
    await dispatch(watchlistActions.getOneList(id));
    await setOneListId(id);
    if(oneListId === id) {
      await setOpenList(!openList)
    } else {
      await setOpenList(true)
    }
  }

  return (
    <>
      <div className="main-page">

        <div className='middle'>

          <div className="total-value">
            $ {(totalValue+user?.available_cash)?.toFixed(2)}
          </div>

          <div className="chart">
            <img src={chart} alt="chart" />
          </div>

          <div className="cash">
            <div className='cash-text'>Buying Power</div>
            <div className='cash-number'>${(user?.available_cash)?.toFixed(2)}</div>
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
                <button onClick={() => setCreateList(!createList)} className='create-watchlist-button'><i className="fas fa-plus"></i></button>
              </div>
            </div>

            {createList && (
            <div className="create-list-form">
                <form onSubmit={handleCreateList}>
                  <input
                    type="text"
                    placeholder="List Name"
                    className="create-list-input"
                  />
                  <div className="create-list-buttons">
                    <button type="submit" className='create-list-create'>Create</button>
                    <button onClick={() => setCreateList(false)} className='create-list-cancel'>Cancel</button>
                  </div>
                </form>
            </div>
            )}
            <div className='list-containter'>
                {Object.values(watchlists).map( (watchlist) => (
                  <div key={watchlist.id}>
                    <div className="one-watchlist">
                      <div onClick={() => handleOpenOneList(watchlist.id)}>{watchlist.name}</div>
                      <div className='oneList-edit-delete'>
                        <OpenModalButton
                          buttonText={<i className="fas fa-edit"></i>}
                          modalComponent={<RenameListModal watchlist={watchlist}/>}
                        />
                        <OpenModalButton
                          buttonText={<i className="fas fa-trash-alt"></i>}
                          modalComponent={<DeleteListModal watchlist={watchlist} setOpenList={setOpenList}/>}
                          className='delete-list-button'
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>



          </div>

          {openList? <div className='list-stocks'>
            <h3> {oneList?.name}</h3>
            <div className='list-stocks-header'>
              <div>Symbol</div>
              <div>Market Price</div>
            </div>
            <div className='show-list-stocks'>
              {Object.values(watchlists)?.length > 0 ? oneList?.stocks?.map(stock => (
                <NavLink
                to={`/search/${stock?.symbol}`}
                key={stock?.id}
                className='stock-link'
                >
                <div className="one-stock">
                  <div>{stock?.symbol}</div>
                  <div>${stock?.market_price}</div>
                </div>
                </NavLink>)): ""}
            </div>

          </div>: ""}

        </div>

      </div>
    </>
  )
}
export default Assets
