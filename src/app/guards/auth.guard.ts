import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthServiceService)
  const router = inject(Router)
  const auth = authService.isLoggedIn();
  const toast = inject(NgToastService);

  if(auth){
    return true;
  }
  else{
    // alert("AccessDenied! Please Login First!")
    toast.error({detail:"ERROR",summary:"AccessDenied! Please Login First!",duration:5000});
    router.navigate(['login']);
    return false;
  }
};
