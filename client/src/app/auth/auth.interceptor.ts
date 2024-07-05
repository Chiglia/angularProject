import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token') ?? '';
  request = request.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '', // Aggiungi 'Bearer' se il backend lo richiede
    },
  });

  return next(request);
};
