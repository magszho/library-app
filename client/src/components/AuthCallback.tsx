import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');

      if (token) {
        const response = await fetch('/auth/google-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          navigate('/');
        } else {
          navigate('/login?error=auth_failed');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Processing login...</div>;
}; 