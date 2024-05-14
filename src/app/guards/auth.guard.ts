import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthServiceService)
  const router = inject(Router)
  const auth = authService.isLoggedIn();

  if(auth){
    return true;
  }
  else{
    alert("AccessDenied! Please Login First!")
    router.navigate(['login']);
    return false;
  }
};
