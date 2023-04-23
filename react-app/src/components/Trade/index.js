import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as assetActions from '../../store/asset';

function Trade({singleAsset}) {

  const dispatch = useDispatch();

  console.log(singleAsset)
  const asset = useSelector(state => state.asset.singleAsset);
  const assets = useSelector(state => state.asset.allAssets);

  useEffect(() => {
    Object.values(assets).forEach( asset => {
      if (asset.symbol === singleAsset.symbol) {
        dispatch(assetActions.getOne(asset.id))
      }
    })
  },[])

  return (
    <>
      <div>{singleAsset.symbol}</div>
    </>
  )
}

export default Trade
