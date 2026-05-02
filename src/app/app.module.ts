import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { StatsDashboardComponent } from './stats-dashboard/stats-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ClientsListComponent,
    ClientFormComponent,
    ClientDetailComponent,
    StatsDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule   // ✅ لازم تكون هنا
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
