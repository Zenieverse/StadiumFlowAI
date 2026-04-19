/**
 * StadiumFlow AI Type Definitions
 */

export interface CrowdData {
  zoneId: string;
  name: string;
  density: number; // 0 to 1
  capacity: number;
  currentAttendees: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface QueueData {
  id: string;
  name: string;
  category: 'food' | 'merch' | 'restroom' | 'entry';
  waitTime: number; // in minutes
  location: string;
  trend: 'up' | 'down' | 'stable';
}

export interface IncidentAlert {
  id: string;
  type: 'medical' | 'security' | 'maintenance' | 'congestion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  description: string;
  status: 'reported' | 'responding' | 'resolved';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'security' | 'medical' | 'cleaning' | 'usher' | 'runner';
  status: 'available' | 'busy' | 'responding' | 'offline';
  location: string;
}

export interface StadiumState {
  totalCapacity: number;
  currentAttendance: number;
  activeGateCount: number;
  vendorsCount: number;
  staffCount: number;
  weather: {
    temp: number;
    condition: string;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  action: string;
  impact: string;
  priority: 'low' | 'high';
}
