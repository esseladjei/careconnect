export enum Role {
   DOCTOR = 'doctor',
   PATIENT = 'patient',
}
export interface UserType {
   firstname: string;
   lastname: string;
   password: string;
   gender: string;
   email: string;
   role: Role;
}
