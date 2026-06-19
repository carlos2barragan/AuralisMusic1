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
}
