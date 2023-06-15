import { useSelector } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';


import image from '../../statistic chart.jpeg'
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
                    <img src={money} width='400px' height='400px' alt="logo" />
                </div>
                <div className="click-me">"Start building your profolio with just $1"</div>
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
