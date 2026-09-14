"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, User } from "lucide-react";

export default function AccountSettingsPage() {
  const [name, setName] = useState("ShopX Customer");
  const [email, setEmail] = useState("customer@example.com");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    localStorage.setItem(
      "shopx-profile",
      JSON.stringify({
        name,
        email,
        phone,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Account
      </Link>

      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
            <User size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Account Settings
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Update your profile information.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Full Name
            </span>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Email Address
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Phone Number
            </span>

            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+880 1XXXXXXXXX"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>

          {saved && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
              Profile updated successfully.
            </div>
          )}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Save size={18} />
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}