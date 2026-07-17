import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Shell } from "@/components/layout/shell";

export default function LoginPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-md py-10">
        <div className="rounded-[2.25rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <Suspense
          fallback={
            <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
              <p className="font-black">Loading login...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
        </div>
      </div>
    </Shell>
  );
}
