import image from '../../Home Page.png'
import { NavLink } from 'react-router-dom';

function Home(){

	return (
    <>
     <div>
      <NavLink to="/login">Login</NavLink>
     </div>
     <div>
      <NavLink to="/signup">Sign Up</NavLink>
     </div>
     <div>
      <img src={image} alt="logo" />
     </div>
    </>
	)
}

export default Home
