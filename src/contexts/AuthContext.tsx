import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
    id: string;
    email: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
};

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
    signUpWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Ensure the user's profile row exists/updated in Supabase
    const ensureProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase
                // Cast to any to avoid mismatch with generated types file
                .from('profiles' as any)
                .upsert(
                    {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name ?? null,
                        avatar_url: user.user_metadata?.avatar_url ?? null,
                    },
                    { onConflict: 'id' }
                );
        } catch { /* ignore if table missing */ }
    };

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            setLoading(true);
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;
            const sessionUser = data.session?.user;
            setUser(
                sessionUser
                    ? { id: sessionUser.id, email: sessionUser.email ?? null, fullName: sessionUser.user_metadata?.full_name, avatarUrl: sessionUser.user_metadata?.avatar_url }
                    : null
            );
            setLoading(false);
        };
        init();

        const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const sessionUser = session?.user;
            setUser(
                sessionUser
                    ? { id: sessionUser.id, email: sessionUser.email ?? null, fullName: sessionUser.user_metadata?.full_name, avatarUrl: sessionUser.user_metadata?.avatar_url }
                    : null
            );
            if (sessionUser) {
                await ensureProfile();
            }
        });

        return () => {
            mounted = false;
            subscription.subscription.unsubscribe();
        };
    }, []);

    const signInWithPassword: AuthContextValue["signInWithPassword"] = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message };
    };

    const signUpWithPassword: AuthContextValue["signUpWithPassword"] = async (email, password) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (!error) await ensureProfile();
        return { error: error?.message };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const signInWithGoogle: AuthContextValue["signInWithGoogle"] = async () => {
        try {
            const redirectTo = window.location.origin + '/auth/callback';
            // Remember where to navigate after callback
            sessionStorage.setItem('returnTo', window.location.pathname);
            const { error } = await supabase.auth.signInWithOAuth({ 
                provider: 'google', 
                options: { 
                    redirectTo,
                    queryParams: {
                        // Force prompt to avoid stale sessions on provider side
                        prompt: 'select_account',
                    },
                } 
            });
            if (error) return { error: error.message };
            return {};
        } catch (e: any) {
            return { error: e?.message || 'OAuth error' };
        }
    };

    const value = useMemo<AuthContextValue>(() => ({ user, loading, signInWithPassword, signUpWithPassword, signOut, signInWithGoogle }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}


