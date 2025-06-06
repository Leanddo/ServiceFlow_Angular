export interface Appointment {
  queue_id: number;
  service_name: string;
  business_name: string;
  business_address: string;
  queue_date: string; // ISO string date
  queue_position: number | null;
  queue_estimate_wait_time: string | null; // "HH:mm:ss"
  status: string; // 'waiting', 'confirmed', 'completed', 'cancelled'
}
