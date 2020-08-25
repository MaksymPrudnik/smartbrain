import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({ isSignedIn, onRouteChange, toggleModal, avatar }) => {
    if (isSignedIn) {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end'}}>
                <ProfileIcon avatar={avatar} onRouteChange={onRouteChange} toggleModal={toggleModal} />
            </nav>
        )
    } else {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end'}}>
                <p 
                    onClick={() => onRouteChange('signin')} 
                    className='f3 link dim black underline pa3 pointer'
                >Sign In</p>
                <p 
                    onClick={() => onRouteChange('register')} 
                    className='f3 link dim black underline pa3 pointer'
                >Register</p>
            </nav>
        )
    }
}

export default Navigation;