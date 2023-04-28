import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';
import * as watchlistActions from '../../store/watchlist';

import logo from'../../Logo.png';

function Navigation(){

	const sessionUser = useSelector(state => state.session.user);
	const searchResult = useSelector(state => state.search.results);

	const [searchActive, setSearchActive] = useState(false);
	const ulRef = useRef();

	useEffect(() => {
		if (!searchActive) return;

		const closeSearch = (e) => {
			if(!ulRef.current.contains(e.target)) {
				setSearchActive(false)
			}
		};

		document.addEventListener('click', closeSearch);

		return () => document.removeEventListener('click', closeSearch);
	}, [searchActive]);

	const searchClassName = "search-results-container" + (searchActive ? "" : " hidden");
  const closeMenu = () => setSearchActive(false);


	const [query, setQuery] = useState('');

	const dispatch = useDispatch();

	const handleSearch = async (e) => {
	  e.preventDefault()
			await dispatch(searchActions.allSearch(query))
  }

	const handleOnChange = async (e) => {
		e.preventDefault()
		await setQuery(e.target.value)
		await dispatch(searchActions.allSearch(e.target.value))
		await setSearchActive(true)
	}

	const clickHome = async (e) => {

		dispatch(searchActions.clearSearch())
		dispatch(assetActions.clearSingle())
		dispatch(watchlistActions.clearAList())
		dispatch(assetActions.getAll())
		await setSearchActive(false)
		await setQuery('')
	}

	const clickSearchResult = async (e) => {
		dispatch(assetActions.clearSingle())
		dispatch(watchlistActions.clearAList())
	}

	return (
		<>
				{sessionUser ?
				<div className='nav'>

					<div className='logo'>
						<NavLink
						exact to="/main"
						onClick={clickHome}
						>
							<img src={logo} alt="logo" width='60px' height='60px'/>
						</NavLink>
					</div>

					<div className='search-bar-search-results'>

						<div className= 'search-bar'>
							<form onSubmit={handleSearch} className='search-form'>
								<i className="fas fa-search"></i>
							<input
								value={query}
								onChange={handleOnChange}
								className='search-input'
								style={{ width: '300px'}}
								placeholder='Search for a stock'
							/>
							</form>

						</div>

						{searchActive === true ? <div className={searchClassName} ref={ulRef}>
							{Object.values(searchResult)[0]?.map( (result) => {
								return (
									<div className='search-result-box' key={result['1. symbol']}>
										<NavLink
										to={`/search/${result['1. symbol']}`}
										className='search-results'
										onClick={clickSearchResult}
										>
										<div className='results-symbols'>{result['1. symbol']}</div>
										<div className='results-names'>{result['2. name']}</div>
										</NavLink>
									</div>
								)})}
						</div> : ""}

					</div>

					<div className='profile-button'>
						<ProfileButton user={sessionUser} />
					</div>

				</div>
				:
				<div className='nav2'>

					<div className='logo'>
						<NavLink
						exact to="/"
						>
							<img src={logo} alt="logo" width='50px' height='50px'/>
						</NavLink>
					</div>

					<div className='title'>Smart Trade</div>

					<div className='login-signup'>
						<div>
							<NavLink className='login-button' to="/login">Log in</NavLink>
						</div>
						<div>
							<NavLink className='signup-button'to="/signup">Sign up</NavLink>
						</div>
					</div>

				</div>}
		</>
	)
}

export default Navigation;
