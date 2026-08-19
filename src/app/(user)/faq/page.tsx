import { Metadata } from "next";
import { Schema } from "../../../components/SEO/Schema";
import { FaqClient } from "./FaqClient";

const SITE_URL = "https://royalfurnitures.store";

export const metadata: Metadata = {
    title: "Frequently Asked Questions | Royal Furniture",
    description:
        "Find answers to the most common questions about delivery, returns, payment, and our furniture. Royal Furniture UK – premium quality, Cash on Delivery.",
    alternates: {
        canonical: "/faq",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Frequently Asked Questions | Royal Furniture",
        description:
            "Find answers to the most common questions about delivery, returns, payment, and our furniture.",
        url: `${SITE_URL}/faq`,
        type: "website",
    },
};

export default async function FaqPage() {
    // Static FAQ data – we pass it to the client
    const faqs = [
        {
            question: "Do you offer free delivery across the UK?",
            answer:
                "Yes! We offer 100% free standard UK delivery on all orders. There are no hidden fees – the price you see is the price you pay.",
        },
        {
            question: "What is Cash on Delivery (COD) and how does it work?",
            answer:
                "Cash on Delivery allows you to pay for your furniture when it arrives at your doorstep. You can inspect the item first and only pay if you're completely satisfied. No advance payment is required.",
        },
        {
            question: "Can I return or exchange my furniture?",
            answer:
                "Absolutely. We offer a 14‑day hassle‑free return policy. If you're not fully satisfied, simply contact our support team and we'll arrange a return or exchange.",
        },
        {
            question: "What is your estimated delivery time?",
            answer:
                "Most UK orders are delivered within 1‑3 business days. We also offer a next‑day delivery option at checkout for urgent orders.",
        },
        {
            question: "Do you assemble the furniture upon delivery?",
            answer:
                "Yes, we offer a white‑glove placement service. Our team will unbox, assemble, and position your furniture in your chosen room. This service is included in your delivery.",
        },
        {
            question: "What materials are used in your furniture?",
            answer:
                "We use high‑quality, sustainable materials including solid hardwoods (oak, walnut, rubberwood), premium upholstery fabrics, and durable engineered wood where appropriate. All our products meet UK safety standards.",
        },
        {
            question: "How do I track my order?",
            answer:
                "Once your order is dispatched, you'll receive a tracking link via email and SMS. You can also check the status of your order anytime in your account dashboard.",
        },
        {
            question: "Is my personal information secure?",
            answer:
                "Yes, we use industry‑standard encryption and security protocols to protect your data. We never share your information with third parties without your explicit consent.",
        },
        {
            question: "Do you offer financing or payment plans?",
            answer:
                "Currently we operate on a Cash on Delivery basis. However, we are exploring interest‑free instalment options – stay tuned for updates!",
        },
        {
            question: "Can I customise the colour or fabric of a product?",
            answer:
                "Many of our products are available in a range of fabrics and colours. Please check the product page for available options. For custom requests, contact our team and we'll do our best to accommodate.",
        },
    ];

    const breadcrumbItems = [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "FAQ", url: `${SITE_URL}/faq` },
    ];

    return (
        <>
            <Schema type="BreadcrumbList" data={{ items: breadcrumbItems }} />
            <Schema type="FAQ" data={{ faqs }} />

            <div className="bg-gradient-to-b from-amber-50/40 to-white border-b border-neutral-200/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-3">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto font-light">
                        Everything you need to know about ordering, delivery, returns, and
                        our furniture.
                    </p>
                </div>
            </div>

            <FaqClient faqs={faqs} />
        </>
    );
}