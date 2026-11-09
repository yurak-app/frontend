import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { usePageTitle } from "../utils/usePageTitle";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";

export function RegisterPage() {
  usePageTitle("Sign up");
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
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
      <h1 className="text-[1.4rem] font-semibold m-0 mb-1">Create your account</h1>
      <p className="text-muted text-sm mb-6">
        This is the only place a Yurak account can be created — your Windows/Android agents will log in
        with it, never sign up.
      </p>

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
          name="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Field
          id="confirmPassword"
          label="Confirm password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-danger text-sm -mt-2 m-0">{error}</p>}

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        Already have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
      </p>
    </div>
  );
}
