"use client";

import React, { useState } from "react";
import { Send, Lock, Mail, Phone, MapPin, ChevronDown, User, MessageSquare, Share2, Globe, Link2, AtSign, Play } from "lucide-react";

export default function ContactFormSection() {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", subject: "", message: "" });

  return (
    <section className="py-8 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Form Box */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Send Us a Message</h2>
                <p className="text-xs text-slate-500">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" placeholder="Enter your full name" className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="email" placeholder="Enter your email" className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="tel" placeholder="Enter your phone number" className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none">
                      <option value="">Select a subject</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea rows={4} placeholder="Tell us how we can help you..." className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none resize-none" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button type="submit" className="rounded-xl bg-blue-950 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-900">
                  Send Message &rarr;
                </button>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Lock className="h-3 w-3" />
                  <span>Your information is safe with us.</span>
                </div>
              </div>
            </form>
          </div>

          {/* Contact Details Right Card */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Mail className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Email Us</p>
                    <p className="text-xs text-slate-600">hello@avenque.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><Phone className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Call Us</p>
                    <p className="text-xs text-slate-600">+94 11 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600"><MapPin className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Visit Our Office</p>
                    <p className="text-xs text-slate-600">No. 123, Innovation Drive, Colombo 00500</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">Follow Us</p>
              <div className="flex items-center gap-2">
                {[Share2, Globe, Link2, AtSign, Play].map((Icon, idx) => (
                  <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}