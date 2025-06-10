import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api';
import {
  Appointment,
  AppointmentFilters,
  Queue,
} from '../model/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(private http: HttpClient) {}

  getAvailableTimes(
    serviceId: number | string,
    date: string
  ): Observable<{ availableTimes: string[] }> {
    const url = API_ENDPOINTS.queues.getAvailableTimes(serviceId, date);
    return this.http.get<{ availableTimes: string[] }>(url);
  }

  createQueue(serviceId: number | string, queueDate: string): Observable<any> {
    const url = API_ENDPOINTS.queues.createQueue(serviceId);
    return this.http.post(
      url,
      { queue_date: queueDate },
      {
        withCredentials: true,
      }
    );
  }

  createQueueOwner(
    serviceId: number | string,
    queueDate: string,
    client_name: string,
    client_email: string
  ): Observable<any> {
    const url = API_ENDPOINTS.queues.createQueueOwner(serviceId);
    return this.http.post(
      url,
      {
        queue_date: queueDate,
        client_name: client_name,
        client_email: client_email,
      },
      {
        withCredentials: true,
      }
    );
  }

  getUserAppointments(): Observable<any[]> {
    return this.http.get<any[]>(API_ENDPOINTS.queues.getUserQueues, {
      withCredentials: true,
    });
  }

  updateStatus(
    serviceId: number | string,
    data: { status: Appointment['status'] }
  ): Observable<any> {
    return this.http.patch(API_ENDPOINTS.queues.queueStatus(serviceId), data, {
      withCredentials: true,
    });
  }

  getQueues(
    business_id: number,
    filters?: AppointmentFilters
  ): Observable<Queue[]> {
    let params = new HttpParams();

    if (filters?.service_id) {
      params = params.append('service_id', filters.service_id.toString());
    }
    if (filters?.end_date) {
      params = params.append('end_date', filters.end_date);
    }
    if (filters?.start_date) {
      params = params.append('start_date', filters.start_date);
    }

    const endpoint = API_ENDPOINTS.queues.getQueues(business_id);
    return this.http.get<Queue[]>(endpoint, { withCredentials: true });
  }
}
