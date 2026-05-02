import { Component, OnInit } from '@angular/core';
import { Client } from '../model/client.model';
import { ClientService } from '../services/client.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-client-detail',
    imports: [
    ReactiveFormsModule ,
    CommonModule,
    NavbarComponent
  ],

  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  client?: Client;
  id?: string;
  txForm!: FormGroup;
  loading = false;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    this.txForm = this.fb.group({
      date: [new Date().toISOString().slice(0,10)],
      amount: [0],
      note: ['']
    });
    if (this.id) this.load();
  }

  load() {
    this.clientService.getClient(this.id!).subscribe(c => this.client = c);
  }

  addTx() {
    if (!this.client) return;
    const val = this.txForm.value;
    this.clientService.addTransaction(this.client._id!, val).subscribe({
      next: (c) => {
        this.client = c;
        this.txForm.reset({ date: new Date().toISOString().slice(0,10), amount: 0, note: ''});
      }
    });
  }
}
