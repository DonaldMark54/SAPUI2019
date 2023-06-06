import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Student } from '../models/api-models/student.model';
import { UpdateStudentRequest } from '../models/api-models/update-student-request.model';
import { AddStudentRequest } from '../models/api-models/add-student-request.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseApiUrl = `${environment.baseApiUrl}`;
  connectToAPI = this.baseApiUrl;
  id: Observable<any>;

  constructor(private httpClient: HttpClient) {}

  // Cross Origins Resource Sharing
  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.connectToAPI + '/Students');
  }

  getStudent(studentId: string): Observable<Student> {
    return this.httpClient.get<Student>(
      this.connectToAPI + '/Students/' + studentId
    );
  }

  updateStudent(
    studentId: string,
    studentRequest: Student
  ): Observable<Student> {
    const updateStudentRequest: UpdateStudentRequest = {
      firstName: studentRequest.firstName,
      lastName: studentRequest.lastName,
      dateOfBirth: studentRequest.dateOfBirth,
      email: studentRequest.email,
      mobile: studentRequest.mobile,
      genderId: studentRequest.genderId,
      physicalAddress: studentRequest.address.physicalAddress,
      postalAddress: studentRequest.address.postalAddress,
      id: '',
    };

    return this.httpClient.put<Student>(
      this.baseApiUrl + '/students/' + studentId,
      updateStudentRequest
    );
  }

  deleteStudent(studentId: string): Observable<Student> {
    return this.httpClient.delete<Student>(
      this.baseApiUrl + '/Students/' + studentId
    );
  }

  addStudent(studentRequest: Student): Observable<Student> {
    const addStudentRequest: AddStudentRequest = {
      firstName: studentRequest.firstName,
      lastName: studentRequest.lastName,
      dateOfBirth: studentRequest.dateOfBirth,
      email: studentRequest.email,
      mobile: studentRequest.mobile,
      genderId: studentRequest.genderId,
      physicalAddress: studentRequest.address.physicalAddress,
      postalAddress: studentRequest.address.postalAddress,
    };

    const displayUrl = this.baseApiUrl + '/Students/Add';
    console.log('**** Display URL *********' + displayUrl);
    return this.httpClient.post<Student>(
      this.baseApiUrl + '/Students/Add',
      addStudentRequest
    );
  }

  uploadImage(studentId: string, file: File): Observable<any> {
    const formData = new FormData();
    let id = studentId;

    // The 'profileImage' name has to be exactly the same as the
    // profileImage name used in the dot net program in the
    // UploadImage method found in the StudentsControler.cs file.
    formData.append('profileImage', file);

    // Change code next line:
    return this.httpClient.post(
      this.baseApiUrl + '/Students/' + studentId + '/upload-image',
      formData,
      { responseType: 'text' }
    );
  }

  getImagePath(relativePath: string) {
    return `${this.baseApiUrl}/${relativePath}`;
  }
}
