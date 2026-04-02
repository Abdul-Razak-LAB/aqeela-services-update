'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendCode = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Could not send verification code.");
        return;
      }

      setCodeSent(true);
      toast.success("Verification code sent to your email.");
    } catch (error) {
      toast.error(error.message || "Could not send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Invalid verification code.");
        return;
      }

      toast.success("Signed in successfully.");
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={codeSent ? verifyCode : sendCode}
        className="w-full max-w-md border border-gray-300 rounded-xl p-6 bg-white space-y-4"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Sign In</h1>
        <p className="text-sm text-gray-600">
          Enter your email to receive a one-time verification code.
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

        {codeSent && (
          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-70 text-white py-2.5 rounded-lg"
        >
          {loading ? "Please wait..." : codeSent ? "Verify & Sign In" : "Send Code"}
        </button>
      </form>
    </div>
  );
}
