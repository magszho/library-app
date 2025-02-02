import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const oauth2SignIn = () => {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create form to submit parameters to OAuth 2.0 endpoint.
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {
      'client_id': process.env.REACT_APP_GOOGLE_CLIENT_ID!,
      'redirect_uri': `${window.location.origin}/auth/google-callback`,
      'response_type': 'token',
      'scope': 'openid profile email',
      'include_granted_scopes': 'true',
      'state': 'pass-through-value'
    };

    // Add form parameters as hidden input values.
    for (const [key, value] of Object.entries(params)) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', value);
      form.appendChild(input);
    }

    // Log the final URL
    const url = `${oauth2Endpoint}?${new URLSearchParams(params).toString()}`;
    console.log('Google OAuth URL:', url);

    // Add form to page and submit it
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error === 'auth_failed' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Authentication failed. Please try again.
          </div>
        )}
        <button 
          onClick={oauth2SignIn}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 
                    flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}; 