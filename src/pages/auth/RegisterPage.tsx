import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ApiError } from "../../api/client";
import { usePageTitle } from "../../utils/usePageTitle";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";

export function RegisterPage() {
  usePageTitle("Ro'yxatdan o'tish — Yurak");
  const { register } = useAuth();
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
      await register(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ro'yxatdan o'tib bo'lmadi. Qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[380px] bg-surface border border-border rounded-2xl p-8 shadow-sm">
      <Link to="/" className="inline-block mb-4">
        <img src="/logo.png" alt="Yurak" className="w-10 h-10 rounded-xl" />
      </Link>
      <h1 className="text-xl font-bold text-ink mb-1">Hisob yaratish</h1>
      <p className="text-muted text-xs mb-6">Yurak telemetriya platformasida yangi shaxsiy hisob ochish.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="email"
          label="Email manzili"
          name="username"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          id="password"
          label="Parol (kamida 6 ta belgi)"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-danger text-xs font-medium">{error}</div>}

        <Button type="submit" disabled={submitting} className="mt-2 w-full justify-center">
          {submitting ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
        </Button>
      </form>

      <p className="text-muted text-xs mt-6 text-center">
        Hisobingiz bormi?{" "}
        <Link to="/login" className="text-accent font-semibold hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  );
}

