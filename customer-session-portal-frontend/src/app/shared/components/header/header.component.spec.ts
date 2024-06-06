import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/authentication-service/auth.service';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [AuthService],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
      ],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngAfterViewInit should update usernameWidth', () => {
    const mockElementRef = {
      nativeElement: {
        querySelector: () => ({ clientWidth: 100 }),
      },
    };
    (component as any).elRef = mockElementRef;
    const detectChangesSpy = jest.spyOn((component as any).cdr, 'detectChanges');
    component.ngAfterViewInit();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('capitalizeFirstLetter should capitalize the first letter', () => {
    const input = 'example';
    const expectedOutput = 'Example';
    const result = component.capitalizeFirstLetter(input);
    expect(result).toBe(expectedOutput);
  });
  it('logOut should call AuthService.logout and navigate to /login', () => {
    const authServiceSpy = jest.spyOn(authService, 'logout');
    authServiceSpy.mockReturnValue(undefined);
    const routerNavigateSpy = jest.spyOn(router, 'navigateByUrl');
    routerNavigateSpy.mockReturnValue(Promise.resolve(true));
    component.logOut();
    expect(authServiceSpy).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith('/login');
  });
  
});
