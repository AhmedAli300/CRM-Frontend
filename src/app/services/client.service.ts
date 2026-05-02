
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../model/client.model';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private base = `${environment.apiUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  getClients(q?: string, page?: number, limit?: number): Observable<Client[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<Client[]>(this.base, { params });
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.base}/${id}`);
  }

  addClient(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.base, client, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.base}/${id}`, client, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteClient(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  addTransaction(id: string, transaction: { date: string; amount: number; note?: string }): Observable<Client> {
    return this.http.post<Client>(`${this.base}/${id}/transactions`, transaction);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.base}/stats/overview`);
  }

  getChartStats(): Observable<{ labels: string[]; data: number[] }> {
    return this.http.get<{ labels: string[]; data: number[] }>(`${this.base}/stats/chart`);
  }
getMonthlyStats(monthNumber: number): Observable<any> {
  return this.http.get<any>(`${this.base}/clients/month/${monthNumber}`).pipe(
    catchError((error) => {
      console.error('Error fetching monthly stats:', error);
      return throwError(() => new Error('فشل في جلب بيانات الشهر'));
    })
  );
}

  

  getTopClients(limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/stats/top-clients`, {
      params: new HttpParams().set('limit', limit.toString())
    });
  }

  getTopFields(): Observable<{ field: string; count: number }[]> {
    return this.http.get<{ field: string; count: number }[]>(`${this.base}/stats/top-fields`);
  }

  getFinancialStats(): Observable<{ totalRevenue: number; avgRevenue: number }> {
    return this.http.get<{ totalRevenue: number; avgRevenue: number }>(`${this.base}/stats/finance`);
  }

  getMarketingCampaignStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/stats/campaigns`);
  }

  getClientTasks(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/${id}/tasks`);
  }

  addClientTask(id: string, task: { title: string; dueDate?: string; note?: string }): Observable<any> {
    return this.http.post(`${this.base}/${id}/tasks`, task, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  addClientComplaint(id: string, complaint: { title: string; description?: string }): Observable<any> {
    return this.http.post(`${this.base}/${id}/complaints`, complaint, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getClientComplaints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/stats/complaints`);
  }

  getClientBehaviorStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/stats/behavior`);
  }

  getLast6MonthsChart(): Observable<{ labels: string[]; data: number[] }> {
    return this.http.get<{ labels: string[]; data: number[] }>(`${this.base}/stats/last6months`);
  }
}
