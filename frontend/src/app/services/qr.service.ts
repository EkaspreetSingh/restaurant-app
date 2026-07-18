import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  private apiUrl = 'http://localhost:5000/api/qr';

  constructor(private http: HttpClient) {}

  // Fetch QR Code Data URL from Express
  generateQrCode(url: string): Observable<{ qrCodeDataUrl: string }> {
    return this.http.get<{ qrCodeDataUrl: string }>(`${this.apiUrl}?url=${encodeURIComponent(url)}`);
  }
}
