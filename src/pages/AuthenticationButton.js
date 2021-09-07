import React from 'react';
import Login from './LoginAuth0.js';
import Logout from './LogoutAuth0.js';
import {useAuth0} from '@auth0/auth0-react';
const AuthenticationButton = () => {
    const {isAuthenticated} = useAuth0();
    return isAuthenticated ? <Logout /> : <Login />;
};
export default AuthenticationButton;