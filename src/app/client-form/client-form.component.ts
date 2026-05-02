import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, CommonModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{8,15}$/)]],
      company: [''],
      field: ['', Validators.required],
      subscriptions: [0, [Validators.min(0)]],
      totalSpent: [0, [Validators.min(0)]],
      lastActivity: [''],
      notes: [''],
      status: ['Active', Validators.required],

      // 🆕 حقول إضافية متوافقة مع الـ Dashboard الجديد
      campaignParticipation: [''],
      satisfaction: [null, [Validators.min(0), Validators.max(100)]],
      nextFollowUp: [''],
      complaint: [''],
      taskAssigned: [''],
      potentialGrowth: [null, [Validators.min(0), Validators.max(100)]],
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.load();
  }

  load() {
    this.clientService.getClient(this.id!).subscribe({
      next: (c) => this.form.patchValue(c),
      error: (err) => console.error('Error loading client:', err)
    });
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value;
    const request = this.id
      ? this.clientService.updateClient(this.id, payload)
      : this.clientService.addClient(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Error saving client:', err);
        this.loading = false;
      }
    });
  }
}
