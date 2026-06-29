export type UserRole =
    | "manager"
    | "procurement"
    | "engineer";

export type UserStatus =
    | "active"
    | "inactive";

export interface User {
    id: string;
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    department: string;
    position: string;
    avatar: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}