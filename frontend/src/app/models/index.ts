export interface SystemInfo {
  hostname: string;
  platform: string;
  platform_version: string;
  architecture: string;
  processor: string;
  python_version: string;
  boot_time: string;
  uptime_seconds: number;
  uptime_formatted: string;
}

export interface CpuInfo {
  count_physical: number;
  count_logical: number;
  percent: number;
  frequency_mhz: number | null;
  frequency_max_mhz: number | null;
  load_average: number[] | null;
  per_cpu_percent: number[];
}

export interface MemoryInfo {
  total: string;
  available: string;
  used: string;
  percent: number;
  swap_total: string;
  swap_used: string;
  swap_percent: number;
}

export interface DiskPartition {
  device: string;
  mountpoint: string;
  fstype: string;
  total: string;
  used: string;
  free: string;
  percent: number;
}

export interface NetworkInterface {
  name: string;
  addresses: Array<{
    family: string;
    address: string;
    netmask: string | null;
    broadcast: string | null;
  }>;
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu_percent: number;
  memory_percent: number;
  created: string | null;
}

export interface ServiceInfo {
  name: string;
  status: string;
  pid?: string;
}

export interface OpenclawStatus {
  status: string;
  gateway_url: string;
  health_response?: any;
  error?: string;
  timestamp: string;
}

export interface AuditEvent {
  id: number;
  timestamp: string;
  type: string;
  description: string;
  user: string | null;
  metadata: any;
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}
