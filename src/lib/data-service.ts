/**
 * Data service for IoT security dashboard
 * Handles data fetching, transformation, and caching
 */

// Types for our security events
export interface FileAccessEvent {
  event: 'file_access';
  file: string;
  pid: number;
  process: string;
  process_path: string;
}

export interface ModuleEvent {
  event: 'module_load';
  args: string[];
  binary: string;
  pid: number;
  process: string;
  process_path: string;
}

export interface RansomwareEvent {
  event: 'ransomware';
  count: number;
  elevated: number;
  file: string;
  pid: number;
  process: string;
  process_path: string;
}

export interface SetuidEvent {
  event: 'setuid' | 'setgid';
  pid: number;
  process: string;
  process_path: string;
  uid?: number;
  gid?: number;
}

export interface UserManagementEvent {
  event: 'user_management';
  args: string[];
  binary: string;
  pid: number;
  process: string;
  process_path: string;
}

export type SecurityEvent = 
  | FileAccessEvent 
  | ModuleEvent 
  | RansomwareEvent 
  | SetuidEvent 
  | UserManagementEvent;

export interface SecurityData {
  file_access: FileAccessEvent[];
  module: ModuleEvent[];
  ransomware: RansomwareEvent[];
  setuid: SetuidEvent[];
  useradd: UserManagementEvent[];
}

export interface Node {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date;
  metrics: {
    cpu: number;
    memory: number;
    events: number;
  };
}

import { mockNodes, initialSecurityData, generateEvents } from '@/constants/mock-data';

// Current security data
let currentData: SecurityData = initialSecurityData;

// Function to update security data
export function updateSecurityData(data: SecurityData) {
  currentData = data;
}

// Function to get current security data
export function getCurrentData(): SecurityData {
  return currentData;
}

// Function to generate new random data
export function generateNewData(count: number = 1000): SecurityData {
  return generateEvents(count);
}

// Helper functions to transform data for UI
export function getAllEvents(): Array<{ id: string } & SecurityEvent> {
  // Combine all events into a single array with unique IDs
  const allEvents = [
    ...currentData.file_access.map((event, index) => ({ ...event, id: `file_${index}` })),
    ...currentData.module.map((event, index) => ({ ...event, id: `module_${index}` })),
    ...currentData.ransomware.map((event, index) => ({ ...event, id: `ransomware_${index}` })),
    ...currentData.setuid.map((event, index) => ({ ...event, id: `setuid_${index}` })),
    ...currentData.useradd.map((event, index) => ({ ...event, id: `useradd_${index}` }))
  ];
  
  return allEvents;
}

export function getEventsByType(type: keyof SecurityData): SecurityEvent[] {
  return currentData[type];
}

export function getEventCount(): Record<keyof SecurityData, number> {
  return {
    file_access: currentData.file_access.length,
    module: currentData.module.length,
    ransomware: currentData.ransomware.length,
    setuid: currentData.setuid.length,
    useradd: currentData.useradd.length
  };
}

// Function to get event timeline data
export function getEventTimeline(): Array<{
  timestamp: string;
  file_access: number;
  ransomware: number;
  user_management: number;
}> {
  // Group events by hour
  const timeline: Record<string, { file_access: number; ransomware: number; user_management: number }> = {};
  
  // Initialize last 24 hours
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    timeline[`${hour}:00`] = {
      file_access: 0,
      ransomware: 0,
      user_management: 0
    };
  }

  // Count events
  currentData.file_access.forEach(event => {
    const hour = new Date().getHours().toString().padStart(2, '0');
    timeline[`${hour}:00`].file_access++;
  });

  currentData.ransomware.forEach(event => {
    const hour = new Date().getHours().toString().padStart(2, '0');
    timeline[`${hour}:00`].ransomware++;
  });

  currentData.useradd.forEach(event => {
    const hour = new Date().getHours().toString().padStart(2, '0');
    timeline[`${hour}:00`].user_management++;
  });

  return Object.entries(timeline).map(([timestamp, counts]) => ({
    timestamp,
    ...counts
  }));
}

export function getNodes(): Node[] {
  return mockNodes;
}

export function getNodeById(id: string): Node | undefined {
  return mockNodes.find(node => node.id === id);
}

// In a real application, these functions would fetch data from an API
export async function fetchSecurityData(): Promise<SecurityData> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(currentData), 500);
  });
}

export async function fetchNodes(): Promise<Node[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNodes), 500);
  });
}
