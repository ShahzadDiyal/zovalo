"use client";
import React, { useState } from "react";
import { SEO } from "../../../components/SEO";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { messageApi } from "../../../services/messageApi";
import SocialLinks from "@/src/components/SocialLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Royal Furniture",  
  description: "Get in touch with Royal Furniture — questions about orders, delivery, or products.",  
  alternates: {
    canonical: "/contact",  
  },
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do you offer free delivery across the UK?",
      a: "Yes! We offer 100% free standard UK delivery on all orders across luxury beds, sofas, wardrobes, and dining sets with zero hidden fees.",
    },
    {
      q: "Can I inspect my furniture before making payment?",
      a: "Absolutely. With our Cash on Delivery service, you can thoroughly inspect your furniture upon arrival before paying a single penny.",
    },
    {
      q: "How fast is the UK delivery process?",
      a: "Most UK orders are dispatched swiftly and delivered within 1 to 3 business days. Next-day delivery options are also available at checkout.",
    },
    {
      q: "What is your return & guarantee policy?",
      a: "We offer a hassle-free 14-day return policy. If you aren't completely satisfied with your piece, simply reach out to our support team.",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject ||
      !formData.message.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await messageApi.createMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again or reach us via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Royal Furniture UK"
        description="Have questions about our luxury beds, sofas, wardrobes, or delivery? Reach out to Royal Furniture support via form, email, or instant WhatsApp message."
      />

      <div className="bg-[#FAF8F5] min-h-screen">
        {/* Luxury Banner Hero Header */}
        <section className="relative bg-neutral-900 text-white py-16 sm:py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                24/7 Dedicated Support
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight mb-4">
              We’re Here to Help You Build <br className="hidden sm:block" />
              <span className="text-amber-400 italic">Your Perfect Home</span>
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
              Have questions about an upcoming order, custom dimensions, or delivery dates? Our design & support consultants are just a message away.
            </p>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Direct Contact Details & WhatsApp Banner */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp Quick Action Card */}
              <div className="bg-gradient-to-br from-emerald-900 to-neutral-900 text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-emerald-800/40 relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Instant Support
                    </span>
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-serif text-white font-bold mb-1">
                    Chat via WhatsApp
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed mb-5 font-light">
                    Need instant answers on stock availability or custom fabric options? Connect directly with our team.
                  </p>
                  <a
                    href="https://wa.me/447529661726"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all duration-200 shadow-md active:scale-98"
                  >
                    Start Chatting (+44 7529 661726)
                  </a>
                </div>
              </div>

              {/* Contact Information Block */}
              <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-lg font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                  Contact Information
                </h3>

                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Main Showroom & Office
                      </h4>
                      <p className="text-neutral-600 text-xs sm:text-sm mt-1 leading-relaxed">
                        Barton Aerodrome, Liverpool Rd, Eccles,
                        <br />
                        Manchester, United Kingdom, M30 7SA
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Email Support
                      </h4>
                      <a
                        href="mailto:sales@royalfurnitures.store"
                        className="text-neutral-600 text-xs sm:text-sm mt-1 block hover:text-amber-600 transition-colors"
                      >
                        sales@royalfurnitures.store
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Phone / WhatsApp
                      </h4>
                      <a
                        href="tel:+447529661726"
                        className="text-neutral-600 text-xs sm:text-sm mt-1 block hover:text-amber-600 transition-colors"
                      >
                        +44 7529 661726
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Business Hours
                      </h4>
                      <p className="text-neutral-600 text-xs sm:text-sm mt-1">
                        Open 24/7 for Online Inquiries
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mt-1">
                        Customer Reps Active Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-neutral-100 text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                    Connect With Us
                  </h4>
                  <div className="flex justify-center">
                    <SocialLinks />
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-neutral-200/80 p-4 rounded-xl flex items-center gap-3">
                  <Truck className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-neutral-900">Free UK Delivery</h5>
                    <p className="text-[9px] text-neutral-500">On all major orders</p>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200/80 p-4 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-neutral-900">Pay on Delivery</h5>
                    <p className="text-[9px] text-neutral-500">Zero risk checkout</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-neutral-200/80 p-6 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="mb-8">
                  <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-1">
                    Send a Message
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 font-bold">
                    How Can We Assist You Today?
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                    Fill out the form below and an advisor will respond within 2–4 business hours.
                  </p>
                </div>

                {submitted && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl mb-6 flex items-start gap-3 text-xs sm:text-sm animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Message Sent Successfully!</strong>
                      Thank you for contacting Royal Furniture. One of our specialists will reach out to you shortly.
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-6 flex items-start gap-3 text-xs sm:text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Your Full Name <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-amber-500 py-3 px-4 text-sm text-neutral-900 outline-none rounded-xl transition-all duration-200"
                        placeholder="e.g. Alexander Wright"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Email Address <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-amber-500 py-3 px-4 text-sm text-neutral-900 outline-none rounded-xl transition-all duration-200"
                        placeholder="e.g. alexander@example.co.uk"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Subject <span className="text-amber-600">*</span>
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-amber-500 py-3 px-4 text-sm text-neutral-900 outline-none rounded-xl transition-all duration-200"
                    >
                      <option value="">Choose an inquiry option...</option>
                      <option value="Order Inquiry">Order Inquiry & Tracking</option>
                      <option value="Product Information">Product Details & Custom Dimensions</option>
                      <option value="Delivery Question">Delivery & Cash on Delivery Details</option>
                      <option value="Return Request">Returns & Guarantees</option>
                      <option value="Other">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Message Details <span className="text-amber-600">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-amber-500 py-3 px-4 text-sm text-neutral-900 outline-none resize-none rounded-xl transition-all duration-200"
                      placeholder="Please detail your question or order number..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neutral-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-98 cursor-pointer"
                  >
                    {loading ? (
                      "Sending Message..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[11px] text-neutral-400 mt-5">
                  🔒 We value your privacy. Your contact info is never shared.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Accordion FAQ Section */}
          <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200/80">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden transition-all duration-200 shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-neutral-900 text-sm sm:text-base hover:bg-neutral-50/50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactUs;