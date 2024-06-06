import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { EditSessionComponent } from './edit-session.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { SessionService } from '../../services/session-service/session.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('EditSessionComponent', () => {
  let component: EditSessionComponent;
  let fixture: ComponentFixture<EditSessionComponent>;
  let dialogRef: MatDialogRef<EditSessionComponent>;
  let toastrServiceMock: any;
  let sessionServiceMock: any;
  let matDialogRefMock: any;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
    toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    sessionServiceMock = {
      updateSession: jest.fn(),
    };

    matDialogRefMock = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [EditSessionComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
      ],
      providers: [
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            sessionName: 'Sample Session',
            remarks: 'Sample Remarks',
          },
        },
      ],
    });

    fixture = TestBed.createComponent(EditSessionComponent);
    dialogRef = TestBed.inject(MatDialogRef);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the edit form with session data', () => {
    const expectedFormValue = {
      sessionName: 'Sample Session',
      remarks: 'Sample Remarks',
    };

    expect(component.editForm.value).toEqual(expectedFormValue);
    expect(component.updateButtonDisabled).toBe(true);
  });

  it('should subscribe to editForm valueChanges in ngOnInit', () => {
    const editForm = formBuilder.group({
      sessionName: '',
      remarks: '',
    });
    component.editForm = editForm;
    let subscriptionCalled = false;

    Object.defineProperty(editForm, 'valueChanges', {
      value: {
        subscribe: (callback: () => void) => {
          callback();
          subscriptionCalled = true;
        },
      },
    });

    component.ngOnInit();

    expect(subscriptionCalled).toBeTruthy();
  });

  it('should handle form submission when form is valid', () => {
    const validFormValues = {
      sessionName: 'New Session Name',
      remarks: 'New Remarks',
    };
    component.editForm.controls['sessionName'].setValue(
      validFormValues.sessionName
    );
    component.editForm.controls['remarks'].setValue(validFormValues.remarks);

    sessionServiceMock.updateSession.mockReturnValue(
      of({ message: 'Update successful' })
    );

    component.onEditFormSubmit();

    expect(toastrServiceMock.success).toHaveBeenCalledWith(
      'Update successful',
      'Success'
    );
    expect(matDialogRefMock.close).toHaveBeenCalledWith(validFormValues);
  });

  it('should handle form submission when form is invalid', () => {
    component.editForm.controls['sessionName'].setValue('');
    component.editForm.controls['remarks'].setValue('');
    component.onEditFormSubmit();
    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'An error while updating the session',
      'Error'
    );
  });

  it('should handle form submission when updateSession throws a 400 error', () => {
    const validFormValues = {
      sessionName: 'New Session Name',
      remarks: 'New Remarks',
    };
    component.editForm.controls['sessionName'].setValue(
      validFormValues.sessionName
    );
    component.editForm.controls['remarks'].setValue(validFormValues.remarks);
    sessionServiceMock.updateSession.mockReturnValue(
      throwError({ status: 400, error: { response: 'Bad Request' } })
    );
    component.onEditFormSubmit();
    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Bad Request',
      'Error'
    );
  });

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
