import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NewSessionComponent } from './new-session.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  ToastrService,
  ToastrModule,
  ToastNoAnimationModule,
} from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IResponseDto } from '../models/session.model';
import { SessionService } from '../../services/session-service/session.service';
import { of, throwError } from 'rxjs';

describe('NewSessionComponent', () => {
  let component: NewSessionComponent;
  let fixture: ComponentFixture<NewSessionComponent>;
  let sessionService: SessionService;
  let dialogRef: MatDialogRef<NewSessionComponent>; // Mocked dialog reference

  beforeEach(() => {
    const matDialogRefStub = {
      close: jest.fn(),
    };
    TestBed.configureTestingModule({
      declarations: [NewSessionComponent],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ToastNoAnimationModule.forRoot(),
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        ToastrService,
      ],
    });

    fixture = TestBed.createComponent(NewSessionComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    dialogRef = TestBed.inject(MatDialogRef); // Inject dialogRef here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set RMname in localStorage and create a session', () => {
    const sessionData = {
      customerId: '123',
      sessionName: 'Test Session',
      remarks: 'Test remarks',
      createdBy: '',
    };
    const createSessionSpy = jest
      .spyOn(sessionService, 'createSession')
      .mockReturnValueOnce(
        of({ message: 'Session created successfully' } as IResponseDto)
      );
    component.createSessionForm.patchValue(sessionData);
    component.createSession();
    expect(createSessionSpy).toHaveBeenCalledWith(sessionData);
  });

  it('should handle session creation success', () => {
    const toastrService = TestBed.inject(ToastrService);
    const toastrSuccessSpy = jest.spyOn(toastrService, 'success');
    const sessionData = {
      customerId: '123',
      sessionName: 'Test Session',
      remarks: 'Test remarks',
      createdBy: '',
    };
    const createSessionSpy = jest
      .spyOn(sessionService, 'createSession')
      .mockReturnValue(
        of({ message: 'Session created successfully' } as IResponseDto)
      );
    component.createSessionForm.patchValue(sessionData);
    component.createSession();
    expect(createSessionSpy).toHaveBeenCalledWith(sessionData);
    expect(toastrSuccessSpy).toHaveBeenCalledWith(
      'Session created successfully',
      'Success'
    );
  });

  it('should handle session creation failure', () => {
    const createSessionSpy = jest
      .spyOn(sessionService, 'createSession')
      .mockReturnValue(throwError('Error occurred'));
    const toastrService = TestBed.inject(ToastrService);
    const toastrErrorSpy = jest.spyOn(toastrService, 'error');
    component.createSession();
    expect(createSessionSpy).toHaveBeenCalled();
    expect(toastrErrorSpy).toHaveBeenCalledWith(
      'Failed to create the session!',
      'Error'
    );
    expect(component.isLoading).toBe(false);
  });

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should have getters for customerId, sessionName, and remarks', () => {
    expect(component.customerId).toBeDefined();
    expect(component.sessionName).toBeDefined();
    expect(component.remarks).toBeDefined();
  });

  it('should get customerId', () => {
    const customerIdControl = component.customerId;
    expect(customerIdControl).toBeTruthy();
  });

  it('should get sessionName', () => {
    const sessionNameControl = component.sessionName;
    expect(sessionNameControl).toBeTruthy();
  });

  it('should get remarks', () => {
    const remarksControl = component.remarks;
    expect(remarksControl).toBeTruthy();
  });
});
