import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Handle PKCE OAuth callback by exchanging the code for a session
        const url = window.location.href;
        if (url.includes('code=')) {
          const { error } = await supabase.auth.exchangeCodeForSession(url);
          if (error) throw error;
        } else {
          // Fallback: ensure session is loaded
          await supabase.auth.getSession();
        }
        const returnTo = sessionStorage.getItem('returnTo') || '/';
        sessionStorage.removeItem('returnTo');
        navigate(returnTo, { replace: true });
      } catch (e: any) {
        setError(e?.message || 'Authentication failed');
      }
    })();
  }, [navigate]);

  return (
    <div className="app-container pt-24 text-sm text-muted-foreground">
      {error ? `Sign-in error: ${error}` : 'Completing sign-in…'}
    </div>
  );
}


