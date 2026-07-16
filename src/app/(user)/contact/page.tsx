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

    // Basic validation
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
      // Save message to Firebase - no authentication required
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
                      Royal Furniture, 123 Design Street,
                      <br />
                      London, United Kingdom, SW1A 1AA
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Call Us
                    </h3>
                    <p className="text-gray-666 text-sm">+44 7526 661726</p>
                    <p className="text-gray-500 text-xs">
                      Mon-Fri, 9 AM - 6 PM GMT
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Email Us
                    </h3>
                    <p className="text-gray-666 text-sm">support@royalfurniture.com</p>
                    <p className="text-gray-500 text-xs">
                      Sales: sales@royalfurniture.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Clock className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <h3 className="font-bold text-near-black text-sm">
                      Business Hours
                    </h3>
                    <p className="text-gray-666 text-sm">
                      Monday - Friday: 9 AM - 6 PM
                    </p>
                    <p className="text-gray-666 text-sm">
                      Saturday: 10 AM - 4 PM
                    </p>
                    <p className="text-gray-666 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-warm-beige p-6 rounded-lg text-center">
              <h3 className="font-bold text-near-black mb-4">Follow Us</h3>
              {/* <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="p-2 bg-cream rounded-full hover:bg-gold transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-walnut group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-cream rounded-full hover:bg-gold transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-walnut group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-cream rounded-full hover:bg-gold transition-colors group"
                >
                  <Twitter className="w-5 h-5 text-walnut group-hover:text-white" />
                </a>
              </div> */}
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
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
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
