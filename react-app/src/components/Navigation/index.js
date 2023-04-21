import React, {useState} from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

import * as searchActions from '../../store/search';

function Navigation({ isLoaded }){

	const sessionUser = useSelector(state => state.session.user);

	const searchResult = useSelector(state => state.search.results);


	const [query, setQuery] = useState('');

	const history = useHistory();
	const dispatch = useDispatch();

	const handleSearch = async (e) => {
	  e.preventDefault()
	  await dispatch(searchActions.allSearch(query))
  }

	return (
		<>
			<ul>
				{sessionUser ?
				<div>

					<div>
						<li>
							<NavLink exact to="/">Home</NavLink>
						</li>
						<li>
							<ProfileButton user={sessionUser} />
						</li>
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
									<NavLink to={`/search/${result['1. symbol']}`} className='search-results'>
									<div>{result['1. symbol']}</div>
									<div>{result['2. name']}</div>
									</NavLink>
								</div>
							)})}
					</div>

				</div>
				:
				<div>
					<li>
						<NavLink className='login-button' to="/login">Log in</NavLink>
					</li>
					<li>
						<NavLink className='signup-button'to="/signup">Sign up</NavLink>
					</li>
				</div>}
			</ul>
		</>
	)
}

export default Navigation;
