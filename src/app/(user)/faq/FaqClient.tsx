"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Link from "next/link";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqClientProps {
    faqs: FaqItem[];
}

export function FaqClient({ faqs }: FaqClientProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = searchQuery.trim()
        ? faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : faqs;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Search bar */}
            <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-200/80 py-2.5 pl-9 pr-3 text-sm rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    />
                </div>
            </div>

            {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-white border border-neutral-200/80 rounded-2xl">
                    <p className="text-neutral-500">No results found for "{searchQuery}".</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredFaqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-amber-50/50 transition-colors"
                                >
                                    <span className="text-sm sm:text-base font-semibold text-neutral-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <span className="flex-shrink-0 ml-2">
                                        {isOpen ? (
                                            <ChevronUp className="w-5 h-5 text-amber-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-neutral-400" />
                                        )}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="p-4 sm:p-5 pt-0 sm:pt-0 border-t border-neutral-100">
                                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Still have questions? */}
            <div className="mt-10 text-center bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 sm:p-8">
                <h3 className="text-base sm:text-lg  font-bold text-neutral-900">
                    Still have questions?
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                    Our team is here to help. Reach out to us anytime.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                    >
                        Contact Us
                    </Link>
                    <a
                        href="https://wa.me/447529661726"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}