import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shell, PageHeader } from "@/components/Shell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Placement Desk" },
      {
        name: "description",
        content: "Sign in to your placement command centre.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              roll,
              branch,
              grad_year: 2026,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/" });
        } else {
          setMessage(
            "Check your email to confirm the account, then sign in.",
          );
        }
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <PageHeader
          eyebrow="Access"
          title={mode === "signin" ? "Welcome back" : "Create your desk"}
          description={
            mode === "signin"
              ? "Sign in to see your live pipeline, interviews and profile scores."
              : "One account. Your applications, calendar and prep stay private."
          }
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          {mode === "signup" && (
            <>
              <div>
                <label className="label-mono mb-1.5 block">Full name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Aarav Raghunathan"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-mono mb-1.5 block">Roll</label>
                  <input
                    required
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    placeholder="21CS1042"
                  />
                </div>
                <div>
                  <label className="label-mono mb-1.5 block">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  >
                    {["CSE", "IT", "ECE", "EEE", "MECH"].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="label-mono mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@college.edu"
            />
          </div>

          <div>
            <label className="label-mono mb-1.5 block">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading
              ? "Working…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have a desk?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </Shell>
  );
}
