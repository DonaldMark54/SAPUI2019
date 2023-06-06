// This interface must match perfectly with
// the UpdateStudentRequest class
// found in the API program.
export interface UpdateStudentRequest {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  mobile: number;
  genderId: string;
  physicalAddress: string;
  postalAddress: string;
}
