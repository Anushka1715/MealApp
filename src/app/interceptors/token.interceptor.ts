import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthServiceService,
    private router:Router,
    private toast:NgToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const myToken = this.auth.getToken();

    // console.log(myToken);

    if(myToken){
      request = request.clone({
        setHeaders:{Authorization: `Bearer ${myToken}`}
      })
    }

    return next.handle(request).pipe(
      catchError((err:any)=> {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            console.log("token expired");
            // alert("Token Expired please login again!");
            //this.toast.warning({detail:"WARNING",summary:"Token Expired Please Login Again!"})
          //   this.auth.logOut();
          // this.router.navigate(['login'])


          //handle request
            return this.handleUnauthorizedError(request,next);
          }
        }
        return throwError(()=> new Error("Error occured"))

      })

      
    );
  }

  handleUnauthorizedError(req:HttpRequest<any>,next:HttpHandler){
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;

    return this.auth.renewToken(tokenApiModel)
    .pipe(
      switchMap((data:TokenApiModel) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);

        req = req.clone({
          setHeaders:{Authorization: `Bearer ${data.accessToken}`}
        })

        return next.handle(req);
      }),
      catchError((err) =>{
        return throwError(() => {
           this.toast.warning({detail:"WARNING",summary:"Token Expired Please Login Again!"})
            this.auth.logOut();
        })
      })
    )
  }
}


