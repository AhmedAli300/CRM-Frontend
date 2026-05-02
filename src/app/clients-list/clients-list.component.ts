import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Client } from '../model/client.model';
import { ClientService } from '../services/client.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  allClients: Client[] = [];
  q = '';
  loading = false;

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.clientService.getClients('').subscribe({
      next: (res: any) => {
        this.allClients = res.items || res;
        this.clients = this.allClients;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearchChange() {
    const query = this.q.trim().toLowerCase();

    if (!query) {
      this.clients = this.allClients;
      return;
    }

    this.clients = this.allClients.filter(c =>
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query)
    );
  }

  view(id: string) {
    this.router.navigate(['/clients', id]);
  }

  edit(id: string) {
    this.router.navigate(['/clients/edit', id]);
  }

  remove(id: string) {
    if (!confirm('Delete this client?')) return;
    this.clientService.deleteClient(id).subscribe(() => this.load());
  }

  getTotalAmount(transactions: { amount?: number }[] = []): number {
    return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  }
}