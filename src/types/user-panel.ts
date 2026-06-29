export interface UserPersonnel {
  empId: string;
  name: string;
  email: string;
  role: "MECHANIC" | "BUYER" | "ADMIN";
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
