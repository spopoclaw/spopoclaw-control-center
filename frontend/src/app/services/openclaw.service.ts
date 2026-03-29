import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpenclawStatus, AuditEvent } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OpenclawService {
  private apiUrl = '/api/openclaw';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<OpenclawStatus> {
    return this.http.get<OpenclawStatus>(`${this.apiUrl}/status`);
  }

  getInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/info`);
  }

  getLogs(lines: number = 50): Observable<{logs: string[]}> {
    return this.http.get<{logs: string[]}>(`${this.apiUrl}/logs?lines=${lines}`);
  }

  getConfig(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = '/api/audit';

  constructor(private http: HttpClient) {}

  getEvents(limit: number = 100): Observable<{events: AuditEvent[], total: number}> {
    return this.http.get<{events: AuditEvent[], total: number}>(`${this.apiUrl}/events?limit=${limit}`);
  }

  getEventTypes(): Observable<{types: string[]}> {
    return this.http.get<{types: string[]}>(`${this.apiUrl}/events/types`);
  }
}
