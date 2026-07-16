"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { UserPersonnel } from "@/types/user-panel";
import { userService } from "@/services/userService";

// Subcomponents
import UserMetricsSummary from "./components/UserMetricsSummary";
import UserControlsPanel from "./components/UserControlsPanel";
import PersonnelTable from "./components/PersonnelTable";
import AddUserModal from "./components/AddUserModal";

export default function UserPanelPage() {
  const [personnelList, setPersonnelList] = useState<UserPersonnel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for creating a new user
  const [newEmpId, setNewEmpId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"ENGINEER" | "PROCUREMENT" | "MANAGER">("ENGINEER");
  const [newDepartment, setNewDepartment] = useState("");
  const [newShift, setNewShift] = useState("Shift 1");

  // Fetch data dari backend saat halaman dimuat
  const fetchUsers = async () => {
    const data = await userService.getAllUsers();
    if (data.length > 0) {
      setPersonnelList(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered List
  const filteredPersonnel = personnelList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRoleFilter === "ALL" || p.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Calculate dynamic stats
  const totalPersonnel = personnelList.length;
  const activeSessions = personnelList.filter((p) => p.status === "ACTIVE").length;
  const systemAdmins = personnelList.filter((p) => p.role === "MANAGER").length;

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
  const handleAddUser = async (e: React.FormEvent) => {
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
      status: "OFFLINE", // Selalu mulai dari offline
      lastActive: "Offline",
    };

    // Panggil backend API
    const success = await userService.addUser(newUser, newPassword || "default123");
    if (!success) {
      alert("Gagal menambahkan user ke database Supabase!");
      return;
    }

    setPersonnelList([newUser, ...personnelList]);
    setShowAddModal(false);

    // Reset Form fields
    setNewEmpId("");
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("ENGINEER");
    setNewDepartment("");
    setNewShift("Shift 1");
  };

  const handleDeleteUser = async (empId: string, name: string) => {
    if (confirm(`Remove personnel ${name} (${empId}) from records?`)) {
      const success = await userService.deleteUser(empId);
      if (success) {
        setPersonnelList(personnelList.filter((p) => p.empId !== empId));
      } else {
        alert("Failed to delete user from database.");
      }
    }
  };

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-8 w-full select-none pb-16">
        
        {/* Header Section & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-gray-500 font-medium">Dashboard/</span>
            <span className="text-[#2B3674] font-bold text-xl">User Pannel</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#4318FF] hover:bg-[#3311CC] active:bg-[#2309A0] text-white text-xs font-bold font-mono rounded-[10px] shadow-[0px_0px_15px_0px_rgba(67,24,255,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all tracking-wider uppercase"
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
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="size-64 absolute -right-24 -top-24 bg-[#4318FF]/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex justify-center items-center shrink-0 text-[#4318FF]">
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
              <h2 className="text-[#2B3674] text-2xl font-bold font-sans">
                Personnel & Access Control
              </h2>
              <p className="text-[#A3AED0] text-xs font-mono font-normal leading-relaxed">
                Manage operators, system administrators, and role-based permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: KPI Metrics summaries */}
        <UserMetricsSummary
          totalPersonnel={totalPersonnel}
          activeSessions={activeSessions}
          systemAdmins={systemAdmins}
        />

        {/* Section 2: Directory Controls */}
        <UserControlsPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRoleFilter={selectedRoleFilter}
          setSelectedRoleFilter={setSelectedRoleFilter}
          handleExportCSV={handleExportCSV}
        />

        {/* Section 3: Personnel Table */}
        <PersonnelTable
          filteredPersonnel={filteredPersonnel}
          handleDeleteUser={handleDeleteUser}
        />

        {/* Section 4: Add User Modal */}
        <AddUserModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newEmpId={newEmpId}
          setNewEmpId={setNewEmpId}
          newName={newName}
          setNewName={setNewName}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          newRole={newRole}
          setNewRole={setNewRole}
          newDepartment={newDepartment}
          setNewDepartment={setNewDepartment}
          newShift={newShift}
          setNewShift={setNewShift}
          handleAddUser={handleAddUser}
        />

      </div>
    </DashboardLayout>
  );
}
