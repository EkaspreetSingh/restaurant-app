import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrService } from '../../services/qr.service';

@Component({
  selector: 'app-table-qr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-qr.component.html',
  styleUrls: ['./table-qr.component.css']
})
export class TableQrComponent {
  menuUrl: string = '';
  qrCodeDataUrl: string = '';
  isGenerating: boolean = false;
  errorMessage: string = '';

  constructor(private qrService: QrService) {
    this.menuUrl = window.location.origin + '/menu';
  }

  generateQrCode(): void {
    if (!this.menuUrl.trim()) {
      this.errorMessage = 'Please enter a valid URL.';
      return;
    }

    this.errorMessage = '';
    this.isGenerating = true;
    this.qrCodeDataUrl = '';

    this.qrService.generateQrCode(this.menuUrl.trim()).subscribe({
      next: (response) => {
        this.qrCodeDataUrl = response.qrCodeDataUrl;
        this.isGenerating = false;
      },
      error: () => {
        this.errorMessage = 'Failed to generate QR code. Please try again.';
        this.isGenerating = false;
      }
    });
  }

  printQrCode(): void {
    window.print();
  }

  downloadQrCode(): void {
    if (!this.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = this.qrCodeDataUrl;
    link.download = 'kimaya-table-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
