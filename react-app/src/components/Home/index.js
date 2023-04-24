import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';


import image from '../../Home Page.png'

function Home(){

    const user = useSelector(state => state.session.user);

    if (user) {
        return <Redirect to="/main" />;
    }

	return (
        <>
            <div>
                <img src={image} alt="logo" />
            </div>
        </>
	)
}

export default Home
