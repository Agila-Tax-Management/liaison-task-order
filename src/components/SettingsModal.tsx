"use client";

import { useState, useEffect } from "react";

interface SettingsModalProps {
  onClose: () => void;
}

interface AppSettings {
  taskOrderPrefix: string;
  taskOrderDigits: number;
  includeYear: boolean;
  messengerGroupChat: string;
  defaultView: "open" | "closed" | "all";
  showConfirmationReminder: boolean;
  officeName: string;
  officeContact: string;
}

const defaultSettings: AppSettings = {
  taskOrderPrefix: "TO",
  taskOrderDigits: 3,
  includeYear: true,
  messengerGroupChat: "Liaison Task Order Group",
  defaultView: "all",
  showConfirmationReminder: true,
  officeName: "Liaison Office",
  officeContact: "liaison@office.gov",
};

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "format" | "data" | "about">("general");

  useEffect(() => {
    const stored = localStorage.getItem("liaison-settings");
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  function handleSave() {
    localStorage.setItem("liaison-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const data = {
      exportedAt: new Date().toISOString(),
      settings,
      note: "This is a backup of your settings. Task order data is stored in the database.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liaison-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings(defaultSettings);
      localStorage.removeItem("liaison-settings");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 bg-linear-to-r from-navy-700 to-navy-800 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <h2 className="text-xl font-bold">System Settings</h2>
                <p className="text-xs text-navy-200">Configure your portal preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 px-6">
          <nav className="flex gap-1">
            {[
              { id: "general", label: "General", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0" },
              { id: "format", label: "Task Order Format", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { id: "data", label: "Data Management", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
              { id: "about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-navy-600 text-navy-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Office Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-text">Office Name</label>
                    <input
                      type="text"
                      value={settings.officeName}
                      onChange={(e) => setSettings({ ...settings, officeName: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Liaison Office"
                    />
                  </div>
                  <div>
                    <label className="label-text">Contact Email</label>
                    <input
                      type="email"
                      value={settings.officeContact}
                      onChange={(e) => setSettings({ ...settings, officeContact: e.target.value })}
                      className="input-field"
                      placeholder="e.g. liaison@office.gov"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Messenger Integration</h3>
                <div>
                  <label className="label-text">Messenger Group Chat Name</label>
                  <input
                    type="text"
                    value={settings.messengerGroupChat}
                    onChange={(e) => setSettings({ ...settings, messengerGroupChat: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Liaison Task Order Group"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    This name will appear in the submission confirmation reminder.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Display Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showConfirmationReminder}
                      onChange={(e) => setSettings({ ...settings, showConfirmationReminder: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Show screenshot reminder</p>
                      <p className="text-xs text-slate-500">Display reminder to send screenshot to Messenger after submission</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Task Order Format Tab */}
          {activeTab === "format" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Task Order Number Format</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Configure how task order numbers are generated.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label-text">Prefix</label>
                    <input
                      type="text"
                      value={settings.taskOrderPrefix}
                      onChange={(e) => setSettings({ ...settings, taskOrderPrefix: e.target.value })}
                      className="input-field"
                      placeholder="TO"
                    />
                  </div>
                  <div>
                    <label className="label-text">Number of Digits</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={settings.taskOrderDigits}
                      onChange={(e) => setSettings({ ...settings, taskOrderDigits: parseInt(e.target.value) || 3 })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-text">Include Year</label>
                    <div className="flex items-center h-10.5">                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.includeYear}
                          onChange={(e) => setSettings({ ...settings, includeYear: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                        />
                        <span className="text-sm text-slate-700">Yes</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-navy-200 bg-navy-50/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-700 mb-2">
                    Preview
                  </p>
                  <p className="font-mono text-lg font-bold text-navy-900">
                    {settings.taskOrderPrefix}
                    {settings.includeYear && `-${new Date().getFullYear()}`}
                    {`-${"1".padStart(settings.taskOrderDigits, "0")}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    First task order number will look like this
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Status Options</h3>
                <p className="mb-3 text-sm text-slate-600">
                  These are the available task statuses (fixed per SOP):
                </p>
                <div className="space-y-2">
                  {[
                    "Done, forwarded to CRT",
                    "Next step - LT",
                    "Lacking, forwarded to CRT (new requirement)",
                    "Lacking, forwarded to CRT (CRT Error)",
                    "Lacking, rescheduled (LT Error)",
                    "Government Delay",
                  ].map((status) => (
                    <div
                      key={status}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                      </svg>
                      <span className="text-sm text-slate-700">{status}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500 italic">
                  Status options are standardized and cannot be modified.
                </p>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Export & Backup</h3>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 text-navy-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Export Settings</p>
                      <p className="mt-1 text-xs text-slate-600">
                        Download your current settings as a JSON file for backup.
                      </p>
                      <button
                        onClick={handleExport}
                        className="mt-3 btn-secondary"
                      >
                        Export Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Reset</h3>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">Reset All Settings</p>
                      <p className="mt-1 text-xs text-red-700">
                        This will restore all settings to their default values. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleReset}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-base font-bold text-navy-900">Database Info</h3>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Database Type:</dt>
                      <dd className="font-medium text-slate-900">SQLite</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Storage Location:</dt>
                      <dd className="font-medium text-slate-900">prisma/dev.db</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Status:</dt>
                      <dd className="font-medium text-emerald-700">Connected</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
            {activeTab === "about" && (
            <div className="space-y-6">
                <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                    <img 
                    src="/logo.png" 
                    alt="Agila Logo" 
                    className="h-full w-full object-contain"
                    />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Agila Liaison Internal</h3>
                <p className="mt-1 text-sm text-slate-500">Task Order Management System</p>
                <p className="mt-1 text-sm text-slate-500">Version 1.0.0</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-sm font-bold text-slate-900">About This System</h4>
                <p className="text-sm leading-relaxed text-slate-700">
                    The Agila Liaison Internal Task Order System is a comprehensive portal designed to manage and track
                    task orders for the Agila Liaison Office. It enables Project Officers to create task
                    orders and Field Liaison Officers to update their status, ensuring smooth
                    coordination and accountability.
                </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-sm font-bold text-slate-900">Standard Operating Procedure</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                    <li>Project Officer creates a new task order and notes the Task Order Number.</li>
                    <li>Project Officer prepares the required documents.</li>
                    <li>Field Liaison Officer searches for the task order in the Portal.</li>
                    <li>Field Liaison Officer updates the status, progress, and next steps.</li>
                    <li>Field Liaison Officer takes a screenshot of the confirmation.</li>
                    <li>Screenshot is sent to the Messenger Group Chat for record.</li>
                </ol>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-sm font-bold text-slate-900">Technical Details</h4>
                <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                    <dt className="text-slate-600">Framework:</dt>
                    <dd className="font-medium text-slate-900">Next.js 15</dd>
                    </div>
                    <div className="flex justify-between">
                    <dt className="text-slate-600">Language:</dt>
                    <dd className="font-medium text-slate-900">TypeScript</dd>
                    </div>
                    <div className="flex justify-between">
                    <dt className="text-slate-600">Styling:</dt>
                    <dd className="font-medium text-slate-900">Tailwind CSS</dd>
                    </div>
                    <div className="flex justify-between">
                    <dt className="text-slate-600">Database:</dt>
                    <dd className="font-medium text-slate-900">SQLite via Prisma</dd>
                    </div>
                </dl>
                </div>

                <div className="text-center text-xs text-slate-500">
                <p>© {new Date().getFullYear()} Agila Liaison Internal</p>
                <p className="mt-1">Internal Use Only</p>
                </div>
            </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          {saved && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Settings saved successfully!
            </div>
          )}
          {!saved && <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}