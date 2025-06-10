export interface Appointment {
  queue_id: number;
  service_name: string;
  business_name: string;
  business_address: string;
  queue_date: string; // ISO string date
  queue_position: number | null;
  queue_estimate_wait_time: string | null; // "HH:mm:ss"
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Queue {
  queue_id: number;
  queue_position: number;
  queue_estimate_wait_time: string; // formato "HH:mm:ss"
  queue_date: string; // ISO string ex: "2025-06-03T09:00:00.000Z"
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  client_name: string;
  client_email: string;
  service_id: number;
  service_name: string;
  business_name: string;
  business_address: string;
}

export interface AppointmentFilters {
  service_id?: number;
  end_date?: string; // Formato YYYY-MM-DD
  start_date?: string; // Formato YYYY-MM-DD
}
