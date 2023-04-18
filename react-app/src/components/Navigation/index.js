import React, { useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as searchActions from '../../store/search';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const [query, setQuery] = useState('');
	let dispatch = useDispatch()
	let history = useHistory();

	const handleSearch = async (e) => {
	  e.preventDefault()
	  dispatch(searchActions.allSearch(query))
      return history.push(`/app/search/${query}`)
    }

	return (
		<div className='pad-tb-25p color-white bg-blue-0bf'>
				{isLoaded && !sessionUser && (
					<ul className='flx-jc-fe mrg20p '>
					<li className='flx gap15p'>
						<a href="/#about" className="color-white-ef2 fontS-125rem">
							About
						</a>
						<div>
							<NavLink to='/login' className={"color-white-ef2 fontS-125rem"}>
								Login
							</NavLink>
						</div>
						<div>
							<NavLink to='/signup' className={"color-white-ef2 fontS-125rem border-white-ef2 borderR-5p pad-tb-5p pad-lr-10p"}>
								Sign up for free
							</NavLink>
						</div>
					</li>
				</ul>
				)}

				{isLoaded && sessionUser && (
					<div className='flx-jc-sb mrg-l-7rem mrg-r-3rem'>
						<Link
						className='color-white-ef2 fontS-125rem va-center'
						to='/'
						>Home</Link>
						<Link
						className='color-white-ef2 fontS-125rem va-center'
						to='/app/all'
						>Dashboard</Link>
						<div className='flx'>
							<form onSubmit={handleSearch} className='bg-blue-0cc pad8p borderR-5p'>

								<i className="fas fa-search mrg-r-8p"></i>

								<input
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className='bg-blue-0cc border-0 color-white mrg-r-8p'/>
								<button
									disabled={!query}
									type='submit'>Search</button>
							</form>

						</div>
						<div className='pos-rel'>
							<ProfileButton user={sessionUser} />
						</div>

					</div>
				)}

		</div>
	);
}

export default Navigation;
