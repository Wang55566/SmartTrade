import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";

import * as searchActions from "../../store/search";

import { useHistory } from 'react-router-dom';

import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);

    dispatch(searchActions.clearSearch());
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout());
    await history.push('/');
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    await alert('Profile page is coming soon!');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu} className='open-drop-down-profile'>
      <i className="fa fa-user" aria-hidden="true"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            {/* <li className='dropdown-profile'>
              <button onClick={handleProfile} className='dropdown-profile-button'>Profile</button>
            </li> */}
            <li className='dropdown-logout'>
              <button onClick={handleLogout} className='dropdown-logout-button'>Log Out</button>
            </li>
          </>
        ) : null}
      </ul>
    </>
  );
}

export default ProfileButton;
