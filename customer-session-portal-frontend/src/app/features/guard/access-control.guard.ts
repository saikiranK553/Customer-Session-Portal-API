import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/constants/string-constant';
import { AuthService } from 'src/app/services/authentication-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccessControlGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.router.navigateByUrl(AppRoutes.LOGIN);
      return false;
    }
  }
}
