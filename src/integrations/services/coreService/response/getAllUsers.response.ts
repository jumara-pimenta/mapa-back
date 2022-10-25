export class GetAllUsersReponse {
    employee_code: string;
    name?: string;
    login?: string;
    email?: string;
    role_id?: number;
    department_id?: number;
    absent?: boolean;
    master?: boolean;
    blocked?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
