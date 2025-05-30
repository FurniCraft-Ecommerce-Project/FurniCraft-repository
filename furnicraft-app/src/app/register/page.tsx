"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar:
      "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
    // Reset error ketika user mulai mengetik
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) {
        // Tampilkan error dari UserModel
        setError(data.message || "An error occurred during registration");
        setIsLoading(false);
        return;
      }

      // Set success state to true
      setSuccess(true);
      setError("");

      // Redirect ke login page setelah berhasil register dengan delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError((err as Error).message || "Failed to register");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="bg-[#333333] p-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v7H7V5zm5 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 font-medium text-xl text-[#333333]">
                FurniCraft
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-normal text-center mb-8 text-[#333333]">
            Create your account
          </h2>

          {/* Success notification */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-r-md">
              <div className="flex">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Registration successful!</p>
                  <p className="text-sm">Redirecting you to login page...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error notification */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#454545] mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:border-[#82776b] transition-colors duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#454545] mb-2"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:border-[#82776b] transition-colors duration-200"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#454545] mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:border-[#82776b] transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#454545] mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:border-[#82776b] transition-colors duration-200"
                placeholder="Create a password"
              />
              <p className="mt-1 text-sm text-[#666666]">
                Password must be at least 5 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || success
                  ? "bg-[#666666] cursor-not-allowed"
                  : "bg-[#333333] hover:bg-[#262626]"
              } focus:outline-none transition-colors duration-200`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : success ? (
                "Registered Successfully"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#666666]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-[#e0e0e0] rounded-md shadow-sm bg-white text-sm font-medium text-[#555555] hover:bg-[#f8f8f8]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-[#e0e0e0] rounded-md shadow-sm bg-white text-sm font-medium text-[#555555] hover:bg-[#f8f8f8]"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#666666]">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="ml-1 font-medium text-[#82776b] hover:text-[#5d534a]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
