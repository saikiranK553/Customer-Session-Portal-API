import { AfterViewInit, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authentication-service/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  usernameWidth = 0;
  constructor(
    public service: AuthService,
    private route: Router,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef 
  ) {}
  ngAfterViewInit(): void {
    const usernameElement = this.elRef.nativeElement.querySelector('#username');
    if (usernameElement) {
      this.usernameWidth = usernameElement.clientWidth;
      this.cdr.detectChanges();
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  logOut() {
    this.service.logout();
    localStorage.clear();
    this.route.navigateByUrl('/login');
  }
}



