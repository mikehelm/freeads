interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function toast(options: ToastOptions) {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
    options.variant === 'destructive' ? 'bg-red-600' : 'bg-zinc-800'
  } text-white z-50 animate-in fade-in slide-in-from-top-2`;
  
  const titleEl = document.createElement('div');
  titleEl.className = 'font-medium';
  titleEl.textContent = options.title;
  
  const descEl = document.createElement('div');
  descEl.className = 'text-sm text-white/80 mt-1';
  descEl.textContent = options.description;
  
  toastEl.appendChild(titleEl);
  toastEl.appendChild(descEl);
  document.body.appendChild(toastEl);
  
  setTimeout(() => {
    toastEl.classList.add('animate-out', 'fade-out', 'slide-out-to-right-2');
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 150);
  }, 5000);
}
