"use client";

import React from "react";
import { Mail } from "lucide-react";

const popularPosts = [
  { id: 1, title: "How to Increase Salon Revenue Without Adding More Clients", date: "Apr 28, 2024", readTime: "5 min read" },
  { id: 2, title: "5 Customer Retention Strategies Every Salon Should Use", date: "Apr 25, 2024", readTime: "4 min read" },
  { id: 3, title: "Understanding Salon Analytics: Metrics That Matter", date: "Apr 22, 2024", readTime: "6 min read" },
];

export default function BlogNewsletterAndPopular() {
  return (
    <section className="py-8 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Newsletter Box */}
          <div className="lg:col-span-7 rounded-3xl border border-blue-100 bg-blue-50/40 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Stay Updated with the Latest Insights</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Subscribe to our newsletter and get the latest tips, trends, and product updates straight to your inbox.
                </p>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
              />
              <button className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-950 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-900 transition-colors">
                Subscribe
              </button>
            </form>
          </div>

          {/* Popular Posts Sidebar */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Popular Posts</h3>

            <div className="space-y-4">
              {popularPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="h-14 w-16 shrink-0 rounded-xl bg-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                    [Thumb]
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-blue-900 cursor-pointer">
                      {post.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">{post.date} • {post.readTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}