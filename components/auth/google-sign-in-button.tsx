"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services-script";

function loadGoogleScript() {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google Sign-In."));

    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({
  mode = "login",
  onSuccess,
}: {
  mode?: "login" | "signup";
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setupGoogleButton() {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!googleClientId) {
        setMessage("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
        return;
      }

      try {
        await loadGoogleScript();

        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        buttonRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            setMessage(null);

            try {
              if (!response.credential) {
                throw new Error("Google did not return a credential.");
              }

              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
              });

              if (error) throw error;

              if (data.user) {
                await supabase.from("profiles").upsert(
                  {
                    id: data.user.id,
                    role: "customer",
                  },
                  {
                    onConflict: "id",
                    ignoreDuplicates: true,
                  }
                );
              }

              const profile = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user?.id)
                .maybeSingle();

              onSuccess?.();
              router.refresh();

              if (profile.data?.role === "business") {
                router.push("/business");
              } else {
                router.push("/deals");
              }
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "Could not sign in with Google."
              );
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: mode === "signup" ? "signup_with" : "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width: 360,
        });
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not load Google Sign-In."
        );
      }
    }

    void setupGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [mode, onSuccess, router]);

  return (
    <div className="space-y-3">
      <div className="flex justify-center" ref={buttonRef} />

      {message ? (
        <p className="rounded-2xl bg-[#F4EFE6] p-3 text-sm text-black/60 dark:bg-[#171411] dark:text-white/50">
          {message}
        </p>
      ) : null}
    </div>
  );
}
