import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IApiResponses,
  ICreateSessionDto,
  IResponseDto,
} from '../../features/models/session.model';
import { IUpdateSessionDto } from '../../features/models/session.model';
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  //private sessions = 'http://172.16.238.164:8080/sessions';
  private sessions = 'http://localhost:8080/sessions';
  constructor(private http: HttpClient) {}

  getSessions(
    status: string,
    offset: number,
    pageSize: number
  ): Observable<IApiResponses> {
    const params = new HttpParams()
      .set('pageNo', offset.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<IApiResponses>(`${this.sessions}/${status}`, {
      params,
    });
  }

  createSession(sessionData: ICreateSessionDto): Observable<IResponseDto> {
    const url = `${this.sessions}`;
    return this.http.post<IResponseDto>(url, sessionData);
  }

  deleteSession(sessionId: string): Observable<IResponseDto> {
    const url = `${this.sessions}/${sessionId}`;
    return this.http.delete<IResponseDto>(url);
  }
  updateSession(
    sessionID: string,
    updateSessionDto: IUpdateSessionDto
  ): Observable<IResponseDto> {
    const url = `${this.sessions}/${sessionID}`;
    return this.http.put<IResponseDto>(url, updateSessionDto);
  }
  archiveSession(sessionId: string): Observable<IResponseDto> {
    const url = `${this.sessions}/archive/${sessionId}`;
    return this.http.put<IResponseDto>(url, null);
  }

}
