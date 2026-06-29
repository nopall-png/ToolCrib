import { UserPersonnel, UserPanelStats } from "@/types/user-panel";

export const initialUserPersonnel: UserPersonnel[] = [
  {
    empId: "EMP-001",
    name: "Alex Johnson",
    email: "alex.j@toolcrib.ai",
    role: "MECHANIC",
    department: "Heavy Machining",
    shift: "Shift 1",
    status: "ACTIVE",
    lastActive: "Just now",
  },
  {
    empId: "EMP-002",
    name: "Sarah Williams",
    email: "sarah.w@toolcrib.ai",
    role: "MECHANIC",
    department: "Assembly Line",
    shift: "Shift 2",
    status: "OFFLINE",
    lastActive: "2 hours ago",
  },
  {
    empId: "EMP-099",
    name: "David Chen",
    email: "david.c@toolcrib.ai",
    role: "BUYER",
    department: "Procurement",
    shift: "Office Hours",
    status: "ACTIVE",
    lastActive: "5 mins ago",
  },
  {
    empId: "EMP-000",
    name: "System Administrator",
    email: "admin@toolcrib.ai",
    role: "ADMIN",
    department: "IT & Operations",
    shift: "24/7",
    status: "ACTIVE",
    lastActive: "Just now",
  },
];

export const initialUserPanelStats: UserPanelStats = {
  totalPersonnel: 4,
  activeSessions: 3,
  systemAdmins: 1,
};
