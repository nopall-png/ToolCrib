"use client";

import React, { useState } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import FormInput from "@/component/common/FormInput";
import Dropdown from "@/component/common/Dropdown";
import { initialUserPersonnel } from "@/data/user-panel";
import { UserPersonnel } from "@/types/user-panel";

export default function UserPanelPage() {
  const [personnelList, setPersonnelList] = useState<UserPersonnel[]>(initialUserPersonnel);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for creating a new user
  const [newEmpId, setNewEmpId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"MECHANIC" | "BUYER" | "ADMIN">("MECHANIC");
  const [newDepartment, setNewDepartment] = useState("");
  const [newShift, setNewShift] = useState("Shift 1");
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "OFFLINE">("ACTIVE");

  // Calculate dynamic stats
  const totalPersonnel = personnelList.length;
  const activeSessions = personnelList.filter((p) => p.status === "ACTIVE").length;
  const systemAdmins = personnelList.filter((p) => p.role === "ADMIN").length;

  // Filtered List
  const filteredPersonnel = personnelList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRoleFilter === "ALL" || p.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Handler for exporting CSV
  const handleExportCSV = () => {
    const headers = ["EMP-ID", "Name", "Email", "Role", "Department", "Shift", "Status", "Last Active"];
    const rows = personnelList.map((p) => [
      p.empId,
      p.name,
      p.email,
      p.role,
      p.department,
      p.shift,
      p.status,
      p.lastActive,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `toolcrib-personnel-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Handler for Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim() || !newEmail.trim() || !newDepartment.trim()) {
      alert("Please fill in Name, Email, and Department.");
      return;
    }

    const empIdCode = newEmpId.trim() || `EMP-${Math.floor(100 + Math.random() * 900)}`;

    if (personnelList.some((p) => p.empId.toLowerCase() === empIdCode.toLowerCase())) {
      alert(`User with Employee ID ${empIdCode} already exists.`);
      return;
    }

    const newUser: UserPersonnel = {
      empId: empIdCode,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      department: newDepartment.trim(),
      shift: newShift,
      status: newStatus,
      lastActive: newStatus === "ACTIVE" ? "Just now" : "Offline",
    };

    setPersonnelList([newUser, ...personnelList]);
    setShowAddModal(false);

    // Reset Form fields
    setNewEmpId("");
    setNewName("");
    setNewEmail("");
    setNewRole("MECHANIC");
    setNewDepartment("");
    setNewShift("Shift 1");
    setNewStatus("ACTIVE");
  };

  const handleDeleteUser = (empId: string, name: string) => {
    if (confirm(`Remove personnel ${name} (${empId}) from records?`)) {
      setPersonnelList(personnelList.filter((p) => p.empId !== empId));
    }
  };

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-8 w-full select-none pb-16">
        
        {/* Header Section & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">User Pannel</span>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold font-mono rounded-[10px] shadow-[0px_0px_15px_0px_rgba(239,68,68,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all tracking-wider uppercase"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span>Add New User</span>
          </button>
        </div>

        {/* Header Panel */}
        <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="size-64 absolute -right-24 -top-24 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex justify-center items-center shrink-0 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-white text-2xl font-bold font-sans">
                Personnel & Access Control
              </h2>
              <p className="text-gray-400 text-xs font-mono font-normal leading-relaxed">
                Manage operators, system administrators, and role-based permissions.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Personnel */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center h-24 shadow-lg">
            <div className="flex flex-col z-10">
              <span className="text-gray-500 text-[10px] font-normal font-mono uppercase tracking-wider">
                Total Personnel
              </span>
              <span className="text-white text-3xl font-bold font-mono mt-1">
                {totalPersonnel}
              </span>
            </div>
            <div className="w-12 h-12 bg-neutral-900 border border-zinc-800 rounded-full flex justify-center items-center shrink-0 text-neutral-400 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-800/10 pointer-events-none"></div>
          </div>

          {/* Card 2: Active Sessions */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center h-24 shadow-lg">
            <div className="flex flex-col z-10">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-gray-500 text-[10px] font-normal font-mono uppercase tracking-wider">
                  Active Sessions
                </span>
              </div>
              <span className="text-white text-3xl font-bold font-mono mt-1">
                {activeSessions}
              </span>
            </div>
            <div className="w-12 h-12 bg-neutral-900 border border-zinc-800 rounded-full flex justify-center items-center shrink-0 text-green-500 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-950/5 pointer-events-none"></div>
          </div>

          {/* Card 3: System Admins */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center h-24 shadow-lg">
            <div className="flex flex-col z-10">
              <span className="text-gray-500 text-[10px] font-normal font-mono uppercase tracking-wider">
                System Admins
              </span>
              <span className="text-white text-3xl font-bold font-mono mt-1">
                {systemAdmins}
              </span>
            </div>
            <div className="w-12 h-12 bg-neutral-900 border border-zinc-800 rounded-full flex justify-center items-center shrink-0 text-red-500 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-950/5 pointer-events-none"></div>
          </div>
        </div>

        {/* Table & Filtering Controls */}
        <div className="flex flex-col gap-4">
          
          {/* Controls Panel */}
          <div className="p-4 bg-neutral-900 border border-zinc-800 rounded-2xl inline-flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or EMP-ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-neutral-950 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-colors text-xs font-mono placeholder-neutral-600"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Role:</span>
                <Dropdown
                  options={[
                    { value: "ALL", label: "All Roles" },
                    { value: "MECHANIC", label: "Mechanic" },
                    { value: "BUYER", label: "Buyer" },
                    { value: "ADMIN", label: "Admin" },
                  ]}
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="h-9 border-zinc-800 py-1"
                />
              </div>
              
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 active:bg-neutral-900 text-gray-400 hover:text-white text-xs font-mono rounded-[10px] border border-zinc-800 transition-colors cursor-pointer"
              >
                EXPORT CSV
              </button>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 min-h-[300px]">
            <div className="overflow-x-auto w-full text-xs font-mono">
              {filteredPersonnel.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 uppercase tracking-widest text-[10px]">
                  No personnel matching search filter.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                      <th className="pb-3.5 px-4">EMP-ID</th>
                      <th className="pb-3.5 px-4">Operator</th>
                      <th className="pb-3.5 px-4">Security Role</th>
                      <th className="pb-3.5 px-4">Department / Shift</th>
                      <th className="pb-3.5 px-4">Network Status</th>
                      <th className="pb-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPersonnel.map((p) => {
                      // Initials helper
                      const initials = p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2);

                      return (
                        <tr
                          key={p.empId}
                          className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                        >
                          <td className="py-4 px-4 font-bold text-gray-400">{p.empId}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-zinc-850 flex items-center justify-center text-[10px] text-gray-400 font-sans font-bold">
                                {initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-sans text-gray-200 font-semibold leading-5 text-[13px]">
                                  {p.name}
                                </span>
                                <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                  </svg>
                                  {p.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-sm text-[9px] font-bold border inline-flex items-center gap-1 ${
                                p.role === "ADMIN"
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : p.role === "BUYER"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-zinc-800/40 text-gray-300 border-zinc-800"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                              {p.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-sans">
                            <span className="text-gray-300 font-medium text-[13px]">{p.department}</span>
                            <br />
                            <span className="text-gray-500 font-mono text-[10px]">{p.shift}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2 w-2">
                                {p.status === "ACTIVE" && (
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span
                                  className={`relative inline-flex rounded-full h-2 w-2 ${
                                    p.status === "ACTIVE" ? "bg-green-500" : "bg-gray-600"
                                  }`}
                                ></span>
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-bold ${
                                  p.status === "ACTIVE" ? "text-gray-200" : "text-gray-500"
                                }`}>
                                  {p.status}
                                </span>
                                <span className="text-[9px] text-gray-600 font-normal leading-3">
                                  {p.lastActive}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {/* Allow deleting any staff except the main system admin for safety */}
                            {p.empId !== "EMP-000" ? (
                              <button
                                onClick={() => handleDeleteUser(p.empId, p.name)}
                                className="text-neutral-600 hover:text-red-500 p-1.5 rounded hover:bg-red-950/20 transition-all cursor-pointer"
                                title="Remove personnel"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            ) : (
                              <span className="text-[9px] text-gray-600 px-1 font-mono uppercase select-none">System</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ADD NEW USER MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="h-1 bg-red-500 w-full"></div>
            
            <div className="p-6 flex flex-col gap-6">
              {/* Modal Title */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white text-lg font-bold">Add New Personnel</h3>
                  <p className="text-gray-500 text-xs font-mono mt-0.5">Register operator to central system.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-white p-1 transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddUser} className="space-y-4">
                <FormInput
                  label="Full Name"
                  placeholder="e.g. Alex Johnson"
                  isRequired
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="e.g. alex@toolcrib.ai"
                  isRequired
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Employee ID (Optional)"
                    placeholder="Auto-generated"
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                  />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
                      Security Role
                    </span>
                    <Dropdown
                      options={[
                        { value: "MECHANIC", label: "Mechanic" },
                        { value: "BUYER", label: "Buyer" },
                        { value: "ADMIN", label: "Admin" },
                      ]}
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as "MECHANIC" | "BUYER" | "ADMIN")}
                      className="w-full h-10 border-zinc-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Department"
                    placeholder="e.g. Heavy Machining"
                    isRequired
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                  />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
                      Shift
                    </span>
                    <Dropdown
                      options={[
                        { value: "Shift 1", label: "Shift 1" },
                        { value: "Shift 2", label: "Shift 2" },
                        { value: "Shift 3", label: "Shift 3" },
                        { value: "Office Hours", label: "Office Hours" },
                        { value: "24/7", label: "24/7" },
                      ]}
                      value={newShift}
                      onChange={(e) => setNewShift(e.target.value)}
                      className="w-full h-10 border-zinc-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
                    Initial Connection Status
                  </span>
                  <Dropdown
                    options={[
                      { value: "ACTIVE", label: "ACTIVE (Online Now)" },
                      { value: "OFFLINE", label: "OFFLINE (Away)" },
                    ]}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as "ACTIVE" | "OFFLINE")}
                    className="w-full h-10 border-zinc-800"
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-mono font-bold text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold font-mono rounded-[10px] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    REGISTER USER
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
