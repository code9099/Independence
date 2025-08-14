import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await supabase.auth.getSession();
      const returnTo = sessionStorage.getItem('returnTo') || '/';
      sessionStorage.removeItem('returnTo');
      navigate(returnTo, { replace: true });
    })();
  }, [navigate]);

  return (
    <div className="app-container pt-24 text-sm text-muted-foreground">
      Completing sign-in…
    </div>
  );
}


