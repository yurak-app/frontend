import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { usePageTitle } from "../utils/usePageTitle";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";

export function LoginPage() {
  usePageTitle("Log in");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[360px] bg-surface border border-border rounded-[20px] p-8">
      <img src="/logo.png" alt="Yurak" className="w-11 h-11 rounded-xl mb-4 block" />
      <h1 className="text-[1.4rem] font-semibold m-0 mb-1">Welcome back</h1>
      <p className="text-muted text-sm mb-6">Log in to your Yurak dashboard.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="email"
          label="Email"
          name="username"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          id="password"
          label="Password"
          name="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-danger text-sm -mt-2 m-0">{error}</p>}

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        No account yet? <Link to="/register" className="text-accent hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
