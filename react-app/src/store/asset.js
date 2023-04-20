const GETALLASSETS  =  'asset/GET_ALL_ASSETS' ;
const GETONEASSET  =  'asset/GET_ONE_ASSET' ;
const CREATEASSET  =  'asset/CREATE_ASSET' ;
const UPDATEASSET  =  'asset/UPDATE_ASSET' ;
const DELETEASSET  =  'asset/DELETE_ASSET' ;

const getAllAssets = (assets) => {
  return {
    type: GETALLASSETS,
    payload: assets
  }
}

const getOneAsset = (asset) => {
  return {
    type: GETONEASSET,
    payload: asset
  }
}

const createAsset = (asset) => {
  return {
    type: CREATEASSET,
    payload: asset
  }
}

const updateAsset = (asset) => {
  return {
    type: UPDATEASSET,
    payload: asset
  }
}

const deleteAsset = (id) => {
  return {
    type: DELETEASSET,
    payload: id
  }
}

export const getAll = () => async (dispatch) => {
  const response = await fetch('/api/assets');
  if(response.ok) {
    const data = await response.json();
    dispatch(getAllAssets(data));
  }
}

export const getOne = (id) => async (dispatch) => {
  const response = await fetch(`/api/assets/${id}`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getOneAsset(data));
  }
}

export const create = (asset) => async (dispatch) => {
  const response = await fetch('/api/assets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asset)
  })
  if(response.ok) {
    const data = await response.json();
    dispatch(createAsset(data));
  }
}

export const update = (asset) => async (dispatch) => {
  const response = await fetch(`/api/assets/${asset.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asset)
  })
  if(response.ok) {
    const data = await response.json();
    dispatch(updateAsset(data));
  }
}

export const remove = (id) => async (dispatch) => {
  const response = await fetch(`/api/assets/${id}`, {
    method: 'DELETE'
  })
  if(response.ok) {
    dispatch(deleteAsset(id));
  }
}

const initialState = {
  allAssets: {},
  singleAsset: {}
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETALLASSETS:
      let state1 = {};
      action.payload.forEach(asset => {
        state1[asset.id] = asset;
      })
      return state1
    default:
      return state;
  }
}

export default assetReducer;
