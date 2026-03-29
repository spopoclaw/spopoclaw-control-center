import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemInfo, CpuInfo, MemoryInfo, DiskPartition, NetworkInterface, ProcessInfo, ServiceInfo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private apiUrl = '/api/system';

  constructor(private http: HttpClient) {}

  getSystemInfo(): Observable<SystemInfo> {
    return this.http.get<SystemInfo>(`${this.apiUrl}/info`);
  }

  getCpuInfo(): Observable<CpuInfo> {
    return this.http.get<CpuInfo>(`${this.apiUrl}/cpu`);
  }

  getMemoryInfo(): Observable<MemoryInfo> {
    return this.http.get<MemoryInfo>(`${this.apiUrl}/memory`);
  }

  getDiskInfo(): Observable<{partitions: DiskPartition[]}> {
    return this.http.get<{partitions: DiskPartition[]}>(`${this.apiUrl}/disk`);
  }

  getNetworkInfo(): Observable<{interfaces: NetworkInterface[]}> {
    return this.http.get<{interfaces: NetworkInterface[]}>(`${this.apiUrl}/network`);
  }

  getProcesses(limit: number = 20): Observable<{processes: ProcessInfo[]}> {
    return this.http.get<{processes: ProcessInfo[]}>(`${this.apiUrl}/processes?limit=${limit}`);
  }

  getServices(): Observable<{services: ServiceInfo[]}> {
    return this.http.get<{services: ServiceInfo[]}>(`${this.apiUrl}/services`);
  }

  getPorts(): Observable<{listening_ports: any[]}> {
    return this.http.get<{listening_ports: any[]}>(`${this.apiUrl}/ports`);
  }
}
