"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Inbox,
  CheckCircle,
  Reply,
  Trash2,
  Eye,
  X,
  Send,
  Clock,
  AlertCircle,
  RefreshCw,
  Filter,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import { messageApi } from "../../../services/messageApi";
import { ContactMessage } from "../../../types";
import { formatCurrency } from "../../../lib/utils";
import { LoadingSpinner } from "../../../components/ui/Loading";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await messageApi.getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await messageApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageApi.markAsRead(id);
      await fetchMessages();
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await messageApi.deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      await fetchMessages();
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      await messageApi.markAsReplied(selectedMessage.id, replyText);
      setShowReplyModal(false);
      setReplyText("");
      await fetchMessages();
      await fetchUnreadCount();
      alert(`Reply sent to ${selectedMessage.email}`);
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-red-100 text-red-600 border border-red-200">
            Unread
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-blue-100 text-blue-600 border border-blue-200">
            Read
          </span>
        );
      case "replied":
        return (
          <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-mint-100 text-mint-700 border border-mint-200">
            Replied
          </span>
        );
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total",
      count: messages.length,
      icon: MessageSquare,
      color: "text-gold",
    },
    { label: "Unread", count: unreadCount, icon: Mail, color: "text-red-500" },
    {
      label: "Read",
      count: messages.filter((m) => m.status === "read").length,
      icon: Eye,
      color: "text-blue-500",
    },
    {
      label: "Replied",
      count: messages.filter((m) => m.status === "replied").length,
      icon: Reply,
      color: "text-mint-700",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-3 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
            Customer Messages
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage customer inquiries and support requests
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              fetchMessages();
              fetchUnreadCount();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-warm-beige text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors rounded"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-warm-beige p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold text-near-black">
                {stat.count}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-warm-beige p-4 flex flex-col sm:flex-row gap-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border-none py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-cream border-none py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest outline-none rounded"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages Table */}
        <div className="bg-white border border-warm-beige overflow-hidden rounded-lg lg:col-span-1">
          <div className="p-4 border-b border-warm-beige bg-cream/30">
            <h3 className="text-sm font-bold uppercase tracking-widest text-near-black">
              Messages ({filteredMessages.length})
            </h3>
          </div>
          <div className="divide-y divide-warm-beige max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center">
                <LoadingSpinner />
                <p className="text-[10px] text-gold mt-2">
                  Loading messages...
                </p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === "unread")
                      handleMarkAsRead(message.id);
                  }}
                  className={`p-4 cursor-pointer transition-all hover:bg-cream/20 ${selectedMessage?.id === message.id ? "bg-gold/5 border-l-4 border-gold" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-near-black text-sm truncate">
                          {message.name}
                        </span>
                        {getStatusBadge(message.status)}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {message.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {message.createdAt
                            ?.toDate()
                            .toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail Panel */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white border border-warm-beige rounded-lg overflow-hidden sticky top-44">
              <div className="p-5 border-b border-warm-beige bg-cream/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-display text-near-black">
                      Message Details
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Received{" "}
                      {selectedMessage.createdAt
                        ?.toDate()
                        .toLocaleString("en-GB")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
                      title="Reply"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-2">
                    Customer Information
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {selectedMessage.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-gold hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-2">
                    Subject
                  </p>
                  <p className="text-sm font-medium text-near-black">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-2">
                    Message
                  </p>
                  <div className="bg-cream/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-666 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {selectedMessage.replyMessage && (
                  <div className="bg-mint-50 p-4 rounded-lg">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-mint-700 mb-2 flex items-center gap-2">
                      <Reply className="w-3 h-3" /> Your Reply
                    </p>
                    <p className="text-sm text-gray-666 leading-relaxed">
                      {selectedMessage.replyMessage}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      Replied on{" "}
                      {selectedMessage.repliedAt
                        ?.toDate()
                        .toLocaleString("en-GB")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-cream/30 border border-dashed border-warm-beige rounded-lg flex flex-col items-center justify-center text-center p-10 h-full min-h-[400px]">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Select a message to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => setShowReplyModal(false)}
          />
          <div className="bg-white max-w-lg w-full relative z-10 shadow-2xl border border-warm-beige rounded-lg">
            <div className="p-5 border-b border-warm-beige flex justify-between items-center">
              <h3 className="text-xl font-display text-near-black">
                Reply to {selectedMessage.name}
              </h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-near-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Your Reply
                </label>
                <textarea
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none rounded resize-none"
                />
              </div>
              <div className="bg-mint-50 p-3 rounded text-xs text-mint-700">
                <strong>Note:</strong> The customer will receive this reply via
                email.
              </div>
            </div>
            <div className="p-5 border-t border-warm-beige bg-cream/30 flex gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="flex-1 border-2 border-near-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-colors rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={sendingReply || !replyText.trim()}
                className="flex-1 bg-near-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded"
              >
                {sendingReply ? "Sending..." : "Send Reply"}
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
