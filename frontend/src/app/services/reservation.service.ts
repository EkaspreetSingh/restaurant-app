import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:5000/api/reservations';

  constructor(private http: HttpClient) {}

  // Create new reservation
  createReservation(reservation: Reservation): Observable<{ message: string, data: Reservation }> {
    return this.http.post<{ message: string, data: Reservation }>(this.apiUrl, reservation);
  }

  // Get reservations list (for management view if needed)
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }
}
