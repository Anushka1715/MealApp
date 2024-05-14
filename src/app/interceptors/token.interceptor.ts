import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthServiceService,
    private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const myToken = this.auth.getToken();

    console.log(myToken);

    if(myToken){
      request = request.clone({
        setHeaders:{Authorization: `Bearer ${myToken}`}
      })
    }
    else{
      console.log("no token!");
    }

    return next.handle(request).pipe(
      catchError((err:any)=> {
        if(err instanceof HttpErrorResponse){
          if(err.status ===400){
            alert("Token Expired please login again!");
            this.router.navigate(['login'])
          }
        }
        return throwError(()=> new Error("Error occured"))
      })
    );
  }
}
