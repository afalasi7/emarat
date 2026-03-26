"use client";

import { useEffect, useState } from "react";
import { fetchSession, postSignOut } from "@/lib/client/api";
import { useAppStore } from "@/store/app-store";

export function useAuthSession() {
  const sessionUser = useAppStore((state) => state.sessionUser);
  const setSessionUser = useAppStore((state) => state.setSessionUser);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let ignore = false;

    void fetchSession()
      .then((result) => {
        if (!ignore) {
          setSessionUser(result.user);
          setAuthError(null);
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setAuthError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load session",
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, [setSessionUser]);

  async function signOut() {
    setSigningOut(true);

    try {
      await postSignOut();
      setSessionUser(null);
      setAuthError(null);
    } catch (requestError) {
      setAuthError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to sign out",
      );
    } finally {
      setSigningOut(false);
    }
  }

  return {
    authError,
    sessionUser,
    setSessionUser,
    signOut,
    signingOut,
  };
}
