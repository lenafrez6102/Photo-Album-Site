'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const res = await signIn("credentials", {
      username: "admin",
      password: password,
      redirect: false,
    });
    if (res?.ok) {
      router.refresh(); // sync the server session first
      router.push("/gallery");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <p className="text-sm text-gray-400 text-center">Enter the password to access the site.</p>
        <input
          type="password"
          placeholder="Password"
          className="px-3 py-2 border rounded-md bg-transparent"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-200"
        >
          Enter
        </button>
      </div>
    </div>
  );
}