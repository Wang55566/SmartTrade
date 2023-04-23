import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

import * as searchActions from '../../store/search';
import * as assetActions from '../../store/asset';

import logo from'../../Logo.png';

function Navigation(){

	const sessionUser = useSelector(state => state.session.user);

	const searchResult = useSelector(state => state.search.results);

	const [searchActive, setSearchActive] = useState(false);

	const [query, setQuery] = useState('');

	const dispatch = useDispatch();

	const handleSearch = async (e) => {
	  e.preventDefault()
	  await dispatch(searchActions.allSearch(query))
		await setSearchActive(true)
  }

	const handleOnChange = async (e) => {
		e.preventDefault()
		await setQuery(e.target.value)
		await dispatch(searchActions.allSearch(e.target.value))
		await setSearchActive(true)
	}

	const handleOnBlur = async (e) => {
		e.preventDefault()
			setQuery('')
			// await console.log('blur')
			// await dispatch(searchActions.clearSearch())
			// await setSearchActive(false)
	}

	const clickHome = (e) => {

		dispatch(searchActions.clearSearch())
		dispatch(assetActions.getAll())
		// await setSearchActive(false)
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
							<img src={logo} alt="logo" width='50px' height='50px'/>
						</NavLink>
					</div>

					<div className='search-bar-search-results'>

						<div className= 'search-bar'>
							<form onSubmit={handleSearch} className='bg-blue-0cc pad8p borderR-5p'>
							<i className="fas fa-search mrg-r-8p"></i>
							<input
								value={query}
								onChange={handleOnChange}
								onBlur={handleOnBlur}
								className='bg-blue-0cc border-0 color-white mrg-r-8p'/>
							</form>
						</div>

						{searchActive === true ? <div className='search-results-container'>
							{Object.values(searchResult)[0]?.map( (result) => {
								return (
									<div key={result['1. symbol']}>
										<NavLink
										to={`/search/${result['1. symbol']}`}
										className='search-results'
										onClick={()=> dispatch(assetActions.clearSingle())}
										>
										<div>Symbol: {result['1. symbol']}</div>
										<div>Company: {result['2. name']}</div>
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
