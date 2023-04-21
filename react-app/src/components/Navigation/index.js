import React, {useState, useEffect} from 'react';
import { NavLink} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

import * as searchActions from '../../store/search';

function Navigation({ isLoaded }){

	const sessionUser = useSelector(state => state.session.user);

	const searchResult = useSelector(state => state.search.results);


	const [query, setQuery] = useState('');

	const dispatch = useDispatch();

	const handleSearch = async (e) => {
	  e.preventDefault()
	  await dispatch(searchActions.allSearch(query))
  }

	return (
		<>
				{sessionUser ?
				<div className='nav'>

					<div>
						<NavLink exact to="/">Home</NavLink>
					</div>

					<div>
						<form onSubmit={handleSearch} className='bg-blue-0cc pad8p borderR-5p'>
						<i className="fas fa-search mrg-r-8p"></i>
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className='bg-blue-0cc border-0 color-white mrg-r-8p'/>
							<button disabled={!query} type='submit'>Search</button>
						</form>
					</div>

					<div>
						{Object.values(searchResult)[0]?.map( (result) => {
							return (
								<div key={result['1. symbol']}>
									<NavLink
									to={`/search/${result['1. symbol']}`}
									className='search-results'
									>
									<div>{result['1. symbol']}</div>
									<div>{result['2. name']}</div>
									</NavLink>
								</div>
							)})}
					</div>

					<div className='profile-button'>
						<ProfileButton user={sessionUser} />
					</div>

				</div>
				:
				<div>
					<div>
						<NavLink className='login-button' to="/login">Log in</NavLink>
					</div>
					<div>
						<NavLink className='signup-button'to="/signup">Sign up</NavLink>
					</div>
				</div>}
		</>
	)
}

export default Navigation;
