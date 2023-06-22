import { useSelector } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';

import money from '../../money.jpg'
import './home.css'

function Home(){

    const user = useSelector(state => state.session.user);

    if (user) {
        return <Redirect to="/main" />;
    }

	return (
        <>
            <div className='home-page'>
                <div className='money'>
                    <img src={money} width='600px' height='600px' alt="logo" />
                </div>
                <div className="click-me">"If you don't find a way to make money while you sleep, you will work until you pass away."
                <div className='home-text'><br></br>- Warren Buffet</div>
                </div>
            </div>
            <div className='footer'>
                <div className='footer-text'>
                    <p>&copy; 2023 SmartTrade. All rights reserved.</p>
                </div>
            </div>
        </>
	)
}

export default Home
