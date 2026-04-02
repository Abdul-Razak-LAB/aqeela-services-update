'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
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
        body: JSON.stringify({ name, email, code }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Invalid verification code.");
        return;
      }

      toast.success("Account ready. You are now signed in.");
      router.push("/");
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
        <h1 className="text-2xl font-semibold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-600">
          Sign up with your email and confirm using a one-time code.
        </p>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

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
          {loading ? "Please wait..." : codeSent ? "Verify & Create Account" : "Send Code"}
        </button>
      </form>
    </div>
  );
}
