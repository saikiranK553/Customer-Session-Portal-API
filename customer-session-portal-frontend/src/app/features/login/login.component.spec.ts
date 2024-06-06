import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/authentication-service/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, HeaderComponent],
      imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatToolbarModule,
        MatMenuModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        AuthService,
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage when loginForm is invalid', () => {
    component.loginForm.setValue({
      username: 'admintoolong',
      password: 'admin123toolong',
    });
    component.login();
    expect(component.errorMessage).toBe(
      'Username and password must be at most 10 characters long.'
    );
  });

  it('should set errorMessage when authService.login returns false', () => {
    const authServiceSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(false);
    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    component.login();
    expect(authServiceSpy).toHaveBeenCalledWith('admin', 'admin123');
    expect(component.errorMessage).toBe('Invalid Credentials!');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /home when authService.login returns true', () => {
    const authServiceSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(true);
    const routerSpy = jest.spyOn(router, 'navigate');
    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    component.login();
    expect(authServiceSpy).toHaveBeenCalledWith('admin', 'admin123');
    expect(component.errorMessage).toBe('');
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should not set errorMessage when loginForm is valid and authService.login returns true', () => {
    const authServiceSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(true);
    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    component.login();
    expect(authServiceSpy).toHaveBeenCalledWith('admin', 'admin123');
    expect(component.errorMessage).toBe('');
  });
});
