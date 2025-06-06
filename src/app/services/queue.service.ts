import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api';

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

  getUserAppointments(): Observable<any[]> {
    return this.http.get<any[]>(API_ENDPOINTS.queues.getUserQueues, { withCredentials: true });
  }

  updateStatus(serviceId: number | string, data: { status: string }): Observable<any> {
    return this.http.patch(API_ENDPOINTS.queues.queueStatus(serviceId), data, { withCredentials: true });
  }
  
}
