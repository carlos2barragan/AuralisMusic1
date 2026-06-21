import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private base = Swal.mixin({
    background: '#12111e',
    color: '#e0e0f0',
    confirmButtonColor: '#B2A179',
    cancelButtonColor: '#252540',
    iconColor: '#B2A179',
    backdrop: 'rgba(0,0,0,0.75)',
    customClass: {
      popup: 'aur-popup',
      confirmButton: 'aur-btn-confirm',
      cancelButton: 'aur-btn-cancel',
      title: 'aur-title',
      htmlContainer: 'aur-text',
    },
  });

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,
    background: '#1a1830',
    color: '#e0e0f0',
    customClass: { popup: 'aur-toast' },
  });

  success(title: string, text?: string): Promise<SweetAlertResult> {
    return this.base.fire({ icon: 'success', title, text });
  }

  error(title: string, text?: string): Promise<SweetAlertResult> {
    return this.base.fire({ icon: 'error', title, text });
  }

  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return this.base.fire({ icon: 'warning', title, text });
  }

  info(title: string, text?: string): Promise<SweetAlertResult> {
    return this.base.fire({ icon: 'info', title, text });
  }

  confirm(title: string, text: string, confirmText = 'Confirmar'): Promise<SweetAlertResult> {
    return this.base.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar',
    });
  }

  loading(title: string, text = ''): void {
    this.base.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  close(): void {
    Swal.close();
  }

  notify(icon: SweetAlertIcon, title: string): void {
    this.toast.fire({ icon, title });
  }

  artistWelcome(nombre: string): Promise<SweetAlertResult> {
    return Swal.fire({
      background: '#0f0d1e',
      color: '#e0e0f0',
      confirmButtonColor: '#B2A179',
      backdrop: `rgba(0,0,0,0.85)`,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: '¡Empezar a crear!',
      customClass: {
        popup: 'aur-welcome-popup',
        confirmButton: 'aur-welcome-btn',
      },
      html: `
        <div class="aur-welcome-body">
          <div class="aur-welcome-orb"></div>
          <div class="aur-welcome-icon">🎤</div>
          <h2 class="aur-welcome-title">¡Bienvenido, ${nombre}!</h2>
          <p class="aur-welcome-sub">Tu solicitud fue <strong>aceptada</strong>.<br>Ahora eres artista en <span class="aur-brand">Auralis</span> y puedes subir tu música al mundo.</p>
          <div class="aur-welcome-chips">
            <span class="aur-chip">🎵 Sube canciones</span>
            <span class="aur-chip">🌍 Llega a más oyentes</span>
            <span class="aur-chip">📊 Ve tus estadísticas</span>
          </div>
        </div>
      `,
      didOpen: () => {
        const style = document.createElement('style');
        style.textContent = `
          .aur-welcome-popup { border-radius: 24px !important; border: 1px solid rgba(178,161,121,0.25) !important; padding: 0 !important; overflow: hidden !important; max-width: 480px !important; }
          .aur-welcome-body { position: relative; padding: 40px 32px 8px; text-align: center; overflow: hidden; }
          .aur-welcome-orb { position: absolute; top: -60px; left: 50%; transform: translateX(-50%); width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(178,161,121,0.15) 0%, transparent 65%); pointer-events: none; }
          .aur-welcome-icon { font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 0 24px rgba(178,161,121,0.6)); animation: aur-bounce 0.6s cubic-bezier(0.22,1,0.36,1) both; }
          .aur-welcome-title { font-size: 26px; font-weight: 900; color: #fff; margin: 0 0 12px; background: linear-gradient(135deg,#fff 40%,#B2A179 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .aur-welcome-sub { font-size: 15px; color: rgba(200,200,220,0.8); line-height: 1.6; margin: 0 0 24px; }
          .aur-welcome-sub strong { color: #c8e6a0; -webkit-text-fill-color: #c8e6a0; }
          .aur-brand { color: #B2A179; font-weight: 700; -webkit-text-fill-color: #B2A179; }
          .aur-welcome-chips { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
          .aur-chip { display: inline-block; padding: 6px 14px; background: rgba(178,161,121,0.1); border: 1px solid rgba(178,161,121,0.25); border-radius: 20px; font-size: 12px; font-weight: 600; color: #B2A179; }
          .aur-welcome-btn { margin-top: 8px !important; padding: 14px 40px !important; border-radius: 14px !important; font-size: 15px !important; font-weight: 800 !important; background: linear-gradient(135deg,#B2A179,#d4bc90) !important; color: #080810 !important; box-shadow: 0 6px 24px rgba(178,161,121,0.4) !important; transition: transform 0.15s, box-shadow 0.2s !important; }
          .aur-welcome-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 32px rgba(178,161,121,0.6) !important; }
          @keyframes aur-bounce { from { opacity:0; transform: scale(0.4) rotate(-10deg); } 60% { transform: scale(1.15) rotate(4deg); } to { opacity:1; transform: scale(1) rotate(0); } }
        `;
        document.head.appendChild(style);
      },
    });
  }
}
