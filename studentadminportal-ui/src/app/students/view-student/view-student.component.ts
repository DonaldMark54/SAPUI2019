import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/api-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, timer } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';

  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');

      if (this.studentId) {
        if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
          // --> new Student Functionality
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        } else {
          // -> Existing Student Functionality
          this.isNewStudent = false;
          this.header = 'Edit Student';

          this.studentService.getStudent(this.studentId).subscribe(
            (successResponse) => {
              this.student = successResponse;
              this.setImage();
            },
            (errorResponse) => {
              this.setImage();
            }
          );
        }

        this.genderService.getGenderList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  onUpdate() {
    if (this.studentDetailsForm.form.valid) {
      // Call Student Service to Update Student
      this.studentService
        .updateStudent(this.student.id, this.student)
        .subscribe(
          (successResponse) => {
            // Show a notification with Material Snackbar
            this.snackbar.open(
              'Student has been updated and saved.',
              undefined,
              {
                duration: 2000,
              }
            );
          },
          (errorResponse) => {
            // Log it
            console.log('********** Student was not saved **************');
            console.log(this.student.id);
            console.log(this.student);
            console.log(errorResponse);
            this.snackbar.open('Student was not saved.', undefined, {
              duration: 2000,
            });
          }
        );
    }
  }

  onDelete() {
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.snackbar.open('Student Deleted Successfully', undefined, {
          duration: 2000,
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  onAdd() {
    if (this.studentDetailsForm.form.valid) {
      // Submit to API
      this.studentService.addStudent(this.student).subscribe(
        (successResponse) => {
          console.log(this.student.firstName);
          console.log('*** Success Response: ***');
          console.log(successResponse);
          this.snackbar.open('Student Added Successfully', undefined, {
            duration: 2000,
          });
          setTimeout(() => {
            this.router.navigateByUrl(`students/${successResponse.id}`);
          }, 2000);
        },
        (errorResponse) => {
          console.log('*** Error Response: ***');
          console.log(errorResponse);
          this.snackbar.open('Data Entry Validation Error', undefined, {
            duration: 2000,
          });
        }
      );
    }
  }

  async uploadImage(event: any): Promise<any> {
    if (this.studentId) {
      const file: File = event.target.files[0];
      if (file === undefined) {
        console.log('File is undefined');
        // Show an error notification
        this.snackbar.open('ERROR: Unable to find image', undefined, {
          duration: 2000,
        });
      } else {
        console.log(file.name); // Selected image name.

        try {
          const fileContent = await this.studentService
            .uploadImage(this.student.id, file)
            .subscribe({
              next: (successResponse) => {
                console.log('Success Response: ');
                console.log(successResponse);
                this.student.profileImageUrl = successResponse;
                // Change this next line
                this.setImage();
                // Show a notification
                this.snackbar.open('Profile image updated', undefined, {
                  duration: 2000,
                });
              },
              error: (errorResponse) => {},
            });
          return fileContent;
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      // Fetch the Image by url
      this.displayProfileImageUrl = this.studentService.getImagePath(
        this.student.profileImageUrl
      );
    } else {
      // Display a default
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }
}
