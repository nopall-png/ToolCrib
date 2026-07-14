"use client";

import React from "react";
import FormInput from "@/component/common/FormInput";
import Dropdown from "@/component/common/Dropdown";

interface AddUserModalProps {
  showAddModal: boolean;
  setShowAddModal: (val: boolean) => void;
  newEmpId: string;
  setNewEmpId: (val: string) => void;
  newName: string;
  setNewName: (val: string) => void;
  newEmail: string;
  setNewEmail: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  newRole: "ENGINEER" | "PROCUREMENT" | "MANAGER";
  setNewRole: (val: "ENGINEER" | "PROCUREMENT" | "MANAGER") => void;
  newDepartment: string;
  setNewDepartment: (val: string) => void;
  newShift: string;
  setNewShift: (val: string) => void;
  handleAddUser: (e: React.FormEvent) => void;
}

export default function AddUserModal({
  showAddModal,
  setShowAddModal,
  newEmpId,
  setNewEmpId,
  newName,
  setNewName,
  newEmail,
  setNewEmail,
  newPassword,
  setNewPassword,
  newRole,
  setNewRole,
  newDepartment,
  setNewDepartment,
  newShift,
  setNewShift,
  handleAddUser,
}: AddUserModalProps) {
  if (!showAddModal) return null;

  return (
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

            <FormInput
              label="Account Password"
              placeholder="e.g. secret123"
              isRequired
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                    { value: "ENGINEER", label: "Engineer" },
                    { value: "PROCUREMENT", label: "Procurement" },
                    { value: "MANAGER", label: "Manager" },
                  ]}
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "ENGINEER" | "PROCUREMENT" | "MANAGER")}
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
  );
}
