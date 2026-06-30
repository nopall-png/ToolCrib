export interface UserPersonnel {
  empId: string;
  name: string;
  email: string;
  role: "ENGINEER" | "PROCUREMENT" | "MANAGER";
  department: string;
  shift: string;
  status: "ACTIVE" | "OFFLINE";
  lastActive: string;
}

export interface UserPanelStats {
  totalPersonnel: number;
  activeSessions: number;
  systemAdmins: number;
}
