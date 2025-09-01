import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Header() {
  const [user, setUser] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      try {
        const profileData = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: {
            'Authorization': `Bearer ${codeResponse.access_token}`
          }
        });
        console.log(profileData)
        const profile = profileData.data;
        localStorage.setItem('user', JSON.stringify(profile));
        setUser(profile);
        /**
         * profileData has the following structure:
         * {
         *  "id": "SOME_ID",
         *  "email": "SOME_EMAIL",
         *  "verified_email": true,
         *  "name": "SOME_NAME",
         *  "given_name": "SOME_GIVEN_NAME",
         *  "family_name": "SOME_FAMILY_NAME",
         *  "picture": "SOME_URL",
         *  "locale": "SOME_LOCALE"
         * }
         */
        //Now you can save the profileData to a database
      } catch (error) {
        console.log('Login Failed', error);
      }
    },
    onError: error => console.log('Login Failed', error),
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
      <img src='logo.svg' alt="Logo" />
      <div className="w-full flex justify-end items-center px-6 py-4">
        {user ? (
          <div className="flex items-center gap-3">
            {/* <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" /> */}
            <span className="text-sm">{user.name}</span>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        ) : (
          <Button onClick={() => login()}>Sign In</Button>
        )}
      </div>
    </div>
  );
}

export default Header;