import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService, Reservation } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservationForm!: FormGroup;
  timeSlots: string[] = [];
  guestOptions: number[] = [];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  minDate = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.generateTimeSlots();
    this.generateGuestOptions();
    this.setMinDate();
    this.initForm();
  }

  private initForm(): void {
    this.reservationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      guests: [2, [Validators.required, Validators.min(1), Validators.max(12)]],
      specialRequests: ['']
    });
  }

  private generateTimeSlots(): void {
    const slots: string[] = [];
    for (let hour = 12; hour <= 21; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === 22) break;
        const h = hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        const minutes = min === 0 ? '00' : '30';
        slots.push(`${h}:${minutes} ${period}`);
      }
    }
    // Add 10:00 PM as the last slot
    slots.push('10:00 PM');
    this.timeSlots = slots;
  }

  private generateGuestOptions(): void {
    this.guestOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  }

  private setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  get f() {
    return this.reservationForm.controls;
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.reservationForm.value;
    const reservation: Reservation = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      specialRequests: formData.specialRequests?.trim() || ''
    };

    this.reservationService.createReservation(reservation).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response.message || 'Your reservation has been confirmed. We look forward to welcoming you!';
        this.reservationForm.reset({ guests: 2 });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again or call us directly.';
      }
    });
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  dismissError(): void {
    this.errorMessage = '';
  }
}
