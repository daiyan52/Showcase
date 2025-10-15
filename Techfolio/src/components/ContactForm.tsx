import React, { useState } from "react";
import axios from "axios";
import './animations.css';
// simple toast component
const Toast = ({ message }: { message: string }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white text-sm font-medium px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
    {message}
  </div>
);

const ContactForm = () => {
  const [form, setForm] = useState({ name1: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<{ loading: boolean; error: string; success: string }>({
    loading: false,
    error: "",
    success: "",
  });
  const [showToast, setShowToast] = useState(false);

  const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    const payload = {
      name1: form.name1.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    };

    if (!payload.name1 || !payload.email) {
      setStatus({
        loading: false,
        error: "Please fill the required fields (Full Name, Email).",
        success: "",
      });
      return;
    }

    try {
      const res = await axios.post(
        "/api/method/techfolio.api.api.submit_get_in_touch",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.message?.status === "success") {
        setStatus({ loading: false, error: "", success: "Thanks! We’ll get back to you shortly." });
        setForm({ name1: "", email: "", phone: "", message: "" });

        // show toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // hide toast after 3s

        // redirect after delay
        setTimeout(() => {
          window.location.href = "/Techfolio"
        }, 3000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      setStatus({
        loading: false,
        error: err?.response?.data?.message || err?.message || "Failed",
        success: "",
      });
    }
  };

  return (
    <>
      {showToast && <Toast message="Form submitted successfully!" />}

      <div className="w-full">
        {/* Removed inner card */}
        <div className="px-0 py-0 mb-4">
          <p className="mt-1 text-sm text-zinc-400">
            Fill the form and we’ll reach out soon.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 text-zinc-200">
          {/* Full Name */}
          <div>
            <label htmlFor="name1" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name1"
              name="name1"
              value={form.name1}
              onChange={onChange}
              required
              className="block w-full rounded-xl border border-white/10 bg-[#0b1426] px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Jane Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="block w-full rounded-xl border border-white/10 bg-[#0b1426] px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="name@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="block w-full rounded-xl border border-white/10 bg-[#0b1426] px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={onChange}
              className="block w-full rounded-xl border border-white/10 bg-[#0b1426] px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="How can we help?"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#0b1426] px-5 py-2.5 text-sm font-medium text-zinc-200 shadow-sm transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting…
                </span>
              ) : (
                "Submit"
              )}
            </button>

            {status.error && <div className="text-sm text-red-400">{status.error}</div>}
          </div>
        </form>
      </div>
    </>
  );
};

export default ContactForm;
