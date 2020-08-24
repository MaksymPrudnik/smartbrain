import React from 'react';
import './ProfileIcon.css';

const ProfileIcon = ({ onRouteChange, toggleModal, avatar }) => {
    return (
        <div className="dropdown">
            <div className="pa4 tc dropbtn">
                <img
                    src={avatar || "http://tachyons.io/img/logo.jpg"}
                    className="br4 dib" alt="avatar" 
                    style={{
                        height: '5rem',
                        width: '5rem'
                    }}
                />
            </div>
            <div className="dropdown-content">
                <p onClick={() => toggleModal()}>Profile</p>
                <p onClick={() => onRouteChange('signout')}>Sign Out</p>
            </div>
        </div>
    )
}

export default ProfileIcon;