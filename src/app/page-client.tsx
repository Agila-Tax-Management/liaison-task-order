"use client";

import { useState } from "react";
import type { TaskOrderSerialized } from "@/types";
import { OpenTaskOrdersTable } from "@/components/OpenTaskOrdersTable";
import { ClosedTaskOrdersTable } from "@/components/ClosedTaskOrdersTable";
import { TaskOrderDetailModal } from "@/components/TaskOrderDetailModal";
import { SettingsModal } from "@/components/SettingsModal";
import Link from "next/link";

interface PageClientProps {
  openTaskOrders: TaskOrderSerialized[];
  closedTaskOrders: TaskOrderSerialized[];
}

export function PageClient({ openTaskOrders, closedTaskOrders }: PageClientProps) {
  const [activeTab, setActiveTab] = useState<"list">("list");
  const [selectedTask, setSelectedTask] = useState<TaskOrderSerialized | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Mobile-Friendly Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === "list"
                ? "bg-blue-700 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Task Orders
            </span>
          </button>
          
          <Link
            href="/orders/new"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium text-sm bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </Link>
          
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2.5 rounded-lg font-medium text-sm bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Task Orders List Tab */}
      <div className="space-y-6 animate-fade-in">
        {/* Open Status */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Open Status</h3>
                <p className="text-xs text-slate-500">Not yet completed</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              {openTaskOrders.length}
            </span>
          </div>
          <div className="p-4">
            {openTaskOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">No open task orders</p>
                <p className="text-xs text-slate-400 mt-1">All tasks have been completed</p>
              </div>
            ) : (
              <OpenTaskOrdersTable 
                taskOrders={openTaskOrders} 
                onTaskClick={setSelectedTask}
              />
            )}
          </div>
        </section>

        {/* Closed Status */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Closed Status</h3>
                <p className="text-xs text-slate-500">Completed tasks</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              {closedTaskOrders.length}
            </span>
          </div>
          <div className="p-4">
            {closedTaskOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">No completed tasks yet</p>
                <p className="text-xs text-slate-400 mt-1">Tasks will appear here when marked as done</p>
              </div>
            ) : (
              <ClosedTaskOrdersTable 
                taskOrders={closedTaskOrders}
                onTaskClick={setSelectedTask}
              />
            )}
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      {selectedTask && (
        <TaskOrderDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}