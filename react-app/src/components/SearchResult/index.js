import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';
import * as session from '../../store/session';
import * as watchlistActions from '../../store/watchlist';

import OpenModalButton from '../OpenModalButton';
import AddStockToListModal from '../AddStockToListModal';

import not_real_chart from '../../statistic chart.jpeg'
import './SearchResult.css'

//Chart
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

function SearchResult() {

  const { symbol } = useParams();

  const [average_cost, setAverageCost] = useState('');
  const [shares, setShares] = useState('');
  const [assetId, setAssetId] = useState('');

  const [inputShares, setInputShares] = useState('');

  const [transaction_buy, setTransactionBuy] = useState(true);

  const [watchlistId, setWatchlistId] = useState('');

  const [errors, setErrors] = useState('');

  const [showMore, setShowMore] = useState(false);

  const assets = useSelector(state => state.asset.allAssets);
  const overview = useSelector(state => state.search.overview);
  const news = useSelector(state => state.search.news);
  const resultDetails = useSelector(state => state.search.resultDetails);
  const intraday = useSelector(state => state.search.intraday);
  const daily = useSelector(state => state.search.daily);
  const singleAsset = useSelector(state => state.asset.singleAsset);
  const user = useSelector(state => state.session.user);
  const watchlists = useSelector(state => state.watchlist.allLists);
  const oneList = useSelector(state => state.watchlist.oneList);

  let quoted_price_to_fixed = resultDetails?.roundedMarketPrice;
  let estimated = (quoted_price_to_fixed * inputShares).toFixed(2);
  let market_value = (shares * quoted_price_to_fixed).toFixed(2);


  // Chart Data
  let dailyData = daily?.['Time Series (Daily)']

  const keys = dailyData ? Object.keys(dailyData) : [];
  const lastSevenDaysData = keys?.slice(-7).reduce((result, key) => {
    result[key] = dailyData?.[key];
    return result;
  }, {});

  //Convert number to suffix
  function convertNumberToSuffix(number) {
    const suffixes = ["", "thousand", "million", "billion", "trillion"];
    const suffixIndex = Math.floor((String(number).length - 1) / 3);
    const suffix = suffixes[suffixIndex];
    const scaledNumber = number / Math.pow(10, suffixIndex * 3);
    const formattedNumber = scaledNumber.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    return formattedNumber + " " + suffix;
  }

  // Chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const labels = Object.keys(lastSevenDaysData);
  const data = {
    labels,
    datasets: [
      {
        label: 'Data',
        data: labels.map((key) => lastSevenDaysData[key]['4. close']),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(watchlistActions.clearAList())
    dispatch(searchActions.clearSearch())
    dispatch(assetActions.getAll())
    dispatch(watchlistActions.getAllLists())

  }, [dispatch])

  useEffect(() => {
    dispatch(searchActions.getOverviewDetails(symbol))
    dispatch(searchActions.getNewsDetails(symbol))
    dispatch(searchActions.getResultDetails(symbol))
    dispatch(searchActions.getIntraday(symbol))
    dispatch(searchActions.getDaily(symbol))
    setErrors('')
    setAssetId('')
    setWatchlistId('')
    Object.values(assets).forEach( asset => {
      if (asset.symbol === symbol) {
        setAverageCost(asset.average_cost)
        setShares(asset.shares)
        setAssetId(asset.id)
    }})

    Object.values(watchlists).map(watchlist => {
      for(let stocks of watchlist.stocks) {
        if(stocks.symbol === symbol) {
          setWatchlistId(stocks.watchlist_id)
        }
      }
    })

  }, [assets, symbol]);

  useEffect(() => {
    if(assetId) {
      dispatch(assetActions.getOne(assetId))
    } else {
      setAverageCost('')
      setShares('')
    }

    if(watchlistId) {
      dispatch(watchlistActions.getOneList(watchlistId))
    } else {
      setWatchlistId('')
    }

  }, [dispatch, assetId, watchlistId])



  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validate input
    let inputSharesNumber = Number(inputShares)
    if(inputSharesNumber < 1 || !Number.isInteger(inputSharesNumber)) {
      setErrors(`${inputShares} is not a valid number of shares`)
      return;
    }

    // Update the asset
    if(Object.values(singleAsset).length !== 0) {

      console.log('Updating asset')

      if (transaction_buy === true) {

        console.log('update buying')
        if(user.available_cash >= (quoted_price_to_fixed * parseInt(inputShares))) {
          const product = singleAsset.average_cost * singleAsset.shares;
          const new_shares = singleAsset.shares + parseInt(inputShares);
          const new_average_cost = ((product + (singleAsset.market_price * parseInt(inputShares))) / new_shares).toFixed(2);
          await dispatch(assetActions.update({ shares: new_shares, average_cost: new_average_cost, id: singleAsset.id }));
          await dispatch(session.cash(user.available_cash - (quoted_price_to_fixed * parseInt(inputShares)), user.id))
          await setShares(new_shares)
          await setAverageCost(new_average_cost)
          await setInputShares('')
        } else {
          setErrors('You do not have enough buying power')
          return
        }
      }

    else {

      if(singleAsset.shares < parseInt(inputShares)) {
        setErrors('You cannot sell more shares than you own')
        return
      } else if(singleAsset.shares === parseInt(inputShares)) {
        console.log('update removing')
        await dispatch(assetActions.remove(singleAsset.id));
        await setShares(0)
        await setAverageCost(0)
        await setInputShares('')
        await dispatch(session.cash(user.available_cash + (quoted_price_to_fixed * parseInt(inputShares)), user.id))
      } else {
        console.log('update selling')
        const new_shares = singleAsset.shares - parseInt(inputShares);
        await dispatch(assetActions.update({ shares: new_shares, average_cost: singleAsset.average_cost, id: singleAsset.id }));
        await setShares(new_shares)
        await setInputShares('')
        await dispatch(session.cash(user.available_cash + (quoted_price_to_fixed * parseInt(inputShares)), user.id))
      }
    }
  }

    // Create a new asset
    else {
      if (transaction_buy === true) {

        if(user.available_cash >= (quoted_price_to_fixed * parseInt(inputShares))) {

          const newAsset = {
            symbol: symbol,
            shares: parseInt(inputShares)
          }
          await dispatch(assetActions.create(newAsset));
          await setInputShares('')
          await setAverageCost(quoted_price_to_fixed)
          await setShares(parseInt(inputShares))
          await dispatch(session.cash(user.available_cash - (quoted_price_to_fixed * parseInt(inputShares)), user.id))
        } else {
          setErrors('You do not have enough buying power')
          return
        }
      }
      else {
        setErrors('You cannot sell shares you do not own')
      }
    }
  }


  return (
    <>
      <div className='single-stock-details'>

        <div className='left-panel'>

          <div className='result-detail'>
            <div>{symbol}</div>
            <div>${quoted_price_to_fixed}</div>
          </div>

          <div className='stock-chart'>
            <Line data={data}/>
          </div>

          <div className='asset-stock-details'>
            {Object.values(singleAsset).length !== 0 ?
              <>
                <div className='asset-left'>
                  <div className='asset-text'>Your market value</div>
                  <div className='bold-price'>${market_value}</div>
                </div>
                <div className='asset-right'>
                  <div className='asset-text'>Your average cost</div>
                  <div className='bold-price'>${average_cost}</div>
                  <div className='asset-text'>Your shares</div>
                  <div className='bold-price'>{shares}</div>
                </div>
              </>
            :
              <>
                <div className='asset-left'>
                  <div className='asset-text'>Your market value</div>
                  <div className='bold-price'>$0.00</div>
                </div>
                <div className='asset-right'>
                  <div className='asset-text'>Your average cost</div>
                  <div className='bold-price'>$0.00</div>
                  <div className='asset-text'> Your shares</div>
                  <div className='bold-price'>0</div>
                </div>
              </>
            }
          </div>

          <div className='stock-info'>
            <div className='stock-info-left'>
              <div className='stock-info-name'>
                <div className='stock-info-name-title'>Company</div>
                <div className='stock-info-name-content'>{overview.Name}</div>
              </div>
              <div className='stock-info-country'>
                <div className='stock-info-country-title'>Country</div>
                <div className='stock-info-country-content'>{overview.Country}</div>
              </div>
            </div>
            <div className='stock-info-right'>
              <div className='stock-info-exchange'>
                <div className='stock-info-exchange-title'>Exchange</div>
                <div className='stock-info-exchange-content'>{overview.Exchange}</div>
              </div>
              <div className='stock-info-capital'>
                <div className='stock-info-capital-title'>Capital</div>
                <div className='stock-info-capital-content'>{convertNumberToSuffix(overview?.MarketCapitalization)}</div>
              </div>
            </div>
          </div>


          <div className='overview'>
            <div className='overview-title'>About Me</div>
            <div className='overview-content' style={{ height: showMore ? "auto" : "46px", overflow: "hidden" }}>{overview.Description}</div>
            <div className='show-more'></div>
            {!showMore? <button onClick={() => setShowMore(!showMore)} className='show-more-buttons'>Show More</button>
            :
            <button onClick={() => setShowMore(!showMore)} className='show-more-buttons'>Show Less</button>}
          </div>

          <div className='news'>
            <div className='news-title'>News</div>
            <div className='news-container'>
              {news?.feed?.map((oneNews) => (
                <div key={oneNews.url} className='one-news'>
                  <a href={oneNews.url}>
                  <div className='one-news-title'>{oneNews.title}</div>
                  <div><img src={oneNews.banner_image} width='200px' alt=''/></div>
                  </a>
                </div>
              ))}
            </div>
          </div>



        </div>

        <div className='right-panel'>

          <div className='trade-panel'>

            <div className='transaction-switch'>
              <button onClick={(e) => setTransactionBuy(!transaction_buy)} className='switch-button'>{transaction_buy === true ? "Switch to sell" : "Switch to Buy"}</button>
            </div>

            <div className='errors'>{errors}</div>

            <div className='transaction-form'>
              <form onSubmit={handleSubmit}>
                <div className='transaction-current-price'>
                  <div className='current-price-text'>Current Price:</div>
                  <div className='current-price-number'>${quoted_price_to_fixed}</div>
                </div>
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
                <div className='transaction-estimated-cost'>
                  <div className='estimated-cost-text'>Estimated Cost: </div>
                  <div className='estimated-cost-number'>${estimated}</div>
                </div>
                <button type="submit" className='transaction-button'>{transaction_buy === true ? "Buy" : "Sell"}</button>
              </form>
            </div>

            <div className='available-cash-in-trade-panel'>
              <div className='cash-text'>Buying Power</div>
              <div className='trade-panel-cash'>${user?.available_cash?.toFixed(2)}</div>
            </div>

          </div>


          <div className='watchlist-container'>
            <div className='one-watchlist-title'>Watchlist</div>
            {Object.values(watchlists).length !== 0 ?<div className='watchlist-content'>
              <OpenModalButton
                className='watchlist-button'
                buttonText={oneList.name ? <i className="fas fa-check">{oneList.name}</i> : <i className="fa fa-plus">Add</i>}
                modalComponent={<AddStockToListModal quoted_price_to_fixed={quoted_price_to_fixed} symbol={symbol}/>}
              />
            </div>: <div className='no-watchlists'>No watchlists have been created yet</div>}
          </div>

        </div>

      </div>
    </>
  )
}

export default SearchResult
