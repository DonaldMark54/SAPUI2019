import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gender } from '../models/api-models/gender.model';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  private baseApiUrl = `${environment.baseApiUrl}`;
  //connectToAPI = this.baseApiUrl;

  constructor(private httpClient: HttpClient) {}

  // Cross Origins Resource Sharing
  getGenderList(): Observable<Gender[]> {
    return this.httpClient.get<Gender[]>(this.baseApiUrl + '/Genders');
  }

  // getGender(genderId: string): Observable<Gender> {
  //   return this.httpClient.get<WebGL2RenderingContextOverloads>(
  //     this.connectToAPI + '/Genders/' + genderId
  //   );
  // }
}
