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
} from "lucide-react";
import { messageApi } from "../../../services/messageApi";

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
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
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
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Get in Touch with Royal Furniture"
        description="Have questions about our furniture collections, delivery, or returns? Contact our customer support team. We're here to help you create your perfect home."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
            Contact Us
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Our team is here to
            assist you with any inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-cream/30 p-6 rounded-lg">
              <h2 className="text-xl font-display text-near-black mb-6">
                Get in Touch
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Visit Us
                    </h3>
                    <p className="text-gray-666 text-sm">
                      Barton Aerodrome, Liverpool Rd, Eccles,
                      <br />
                      Manchester, United Kingdom, M30 7SA
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Whatsapp
                    </h3>
                    <p className="text-gray-666 text-sm">+44 7529 661726</p>
                    {/* <p className="text-gray-500 text-xs">Always Open</p> */}
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Email Us
                    </h3>
                    <p className="text-gray-666 text-sm">
                      sales@royalfurnitures.store
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Clock className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Business Hours
                    </h3>
                    <p className="text-gray-666 text-sm">Always Open</p>
                    <p className="text-gray-500 text-xs">
                      24/7 Customer Support
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-warm-beige p-6 rounded-lg text-center">
              <h3 className="font-bold text-near-black mb-4">Follow Us</h3>
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61591759840955"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-cream rounded-full hover:bg-gold transition-colors group"
                  aria-label="Follow us on Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-walnut group-hover:text-white transition-colors"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Stay updated with our latest collections and offers
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-warm-beige p-6 sm:p-8 rounded-lg">
              <h2 className="text-xl font-display text-near-black mb-6">
                Send Us a Message
              </h2>

              {submitted && (
                <div className="bg-mint-50 border border-mint-200 text-mint-700 p-4 rounded-lg mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>
                    Thank you! Your message has been sent. We'll get back to you
                    soon.
                  </span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                      placeholder="Royal Furnitures"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                      placeholder="george@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                  >
                    <option value="">Select a subject</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Product Information">
                      Product Information
                    </option>
                    <option value="Delivery Question">Delivery Question</option>
                    <option value="Return Request">Return Request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none resize-none rounded"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 rounded"
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="w-4 h-4" />}
                </button>
              </form>

              <p className="text-center text-[10px] text-gray-400 mt-4">
                By submitting this form, you agree to our privacy policy. We'll
                never share your information.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-8 border-t border-warm-beige">
          <h2 className="text-2xl font-display text-near-black text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-near-black">
                Do you offer free delivery?
              </h3>
              <p className="text-gray-666 text-sm">
                Yes! We offer free standard delivery across the United Kingdom
                on all orders.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-near-black">
                Can I inspect before paying?
              </h3>
              <p className="text-gray-666 text-sm">
                Absolutely! With our Cash on Delivery option, you can inspect
                your furniture before making payment.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-near-black">
                What is your return policy?
              </h3>
              <p className="text-gray-666 text-sm">
                We offer a 14-day return policy. Contact our support team to
                initiate a return.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-near-black">
                How long does delivery take?
              </h3>
              <p className="text-gray-666 text-sm">
                UK delivery: 1-3 days. International delivery to Europe: 3-5
                days, Canada: 5-7 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
