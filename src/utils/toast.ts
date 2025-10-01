/**
 * Simple toast notification utility
 */

export interface ToastOptions {
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
}

class ToastManager {
  private toasts: Array<{
    id: string;
    message: string;
    type: ToastOptions['type'];
    duration: number;
  }> = [];

  private listeners: Array<(toasts: typeof this.toasts) => void> = [];

  show(message: string, options: ToastOptions = {}) {
    const { duration = 3000, type = 'info' } = options;
    
    const toast = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      duration,
    };

    this.toasts.push(toast);
    this.notifyListeners();

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);

    return toast.id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  clear() {
    this.toasts = [];
    this.notifyListeners();
  }

  subscribe(listener: (toasts: typeof this.toasts) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  // Convenience methods
  success(message: string, duration?: number) {
    return this.show(message, { type: 'success', duration });
  }

  error(message: string, duration?: number) {
    return this.show(message, { type: 'error', duration });
  }

  warning(message: string, duration?: number) {
    return this.show(message, { type: 'warning', duration });
  }

  info(message: string, duration?: number) {
    return this.show(message, { type: 'info', duration });
  }
}

export const toast = new ToastManager();
