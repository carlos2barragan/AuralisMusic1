import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { AlertService } from '../../services/alert.service';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-admin-solicitudes',
  templateUrl: './admin-solicitudes.component.html',
  styleUrls: ['./admin-solicitudes.component.css'],
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
})
export class AdminSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  loading = false;
  filtro: string = 'pendiente';
  procesando: Record<string, boolean> = {};

  constructor(
    private solicitudService: SolicitudService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.solicitudService.listar(this.filtro || undefined).subscribe({
      next: (data) => { this.solicitudes = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setFiltro(f: string): void {
    this.filtro = f;
    this.cargar();
  }

  aceptar(s: any): void {
    this.procesando[s._id] = true;
    this.solicitudService.aceptar(s._id).subscribe({
      next: () => {
        this.alert.success('Aceptada', `${s.nombre} ahora es artista.`);
        this.cargar();
      },
      error: (err) => {
        this.alert.error('Error', err?.error?.message || 'No se pudo aceptar.');
        this.procesando[s._id] = false;
      }
    });
  }

  rechazar(s: any): void {
    this.procesando[s._id] = true;
    this.solicitudService.rechazar(s._id).subscribe({
      next: () => {
        this.alert.notify('info', `Solicitud de ${s.nombre} rechazada.`);
        this.cargar();
      },
      error: (err) => {
        this.alert.error('Error', err?.error?.message || 'No se pudo rechazar.');
        this.procesando[s._id] = false;
      }
    });
  }
}
