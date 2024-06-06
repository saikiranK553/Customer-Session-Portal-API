import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteSessionComponent } from './delete-session.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../../services/session-service/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ISession, IResponseDto } from '../models/session.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

describe('DeleteSessionComponent', () => {
  let component: DeleteSessionComponent;
  let fixture: ComponentFixture<DeleteSessionComponent>;
  let sessionService: SessionService;
  let snackBar: MatSnackBar;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSessionComponent],
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: SessionService,
          useValue: {
            deleteSession: jest.fn().mockReturnValue(
              of({
                httpStatus: '200',
                message: 'Deleted successfully',
                sessionResponseDTO: {},
              } as IResponseDto)
            ),
          },
        },
        MatSnackBar,
      ],
    });
    fixture = TestBed.createComponent(DeleteSessionComponent);
    component = fixture.componentInstance;
    // Get an instance of MatSnackBar from TestBed
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on onCancelClick', () => {
    component.onCancelClick();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalled();
  });

  it('should call sessionService.deleteSession and close dialog on deleteSession', () => {
    const mockSession: ISession = {
      sessionId: '1',
      sessionName: 'Sample Session',
      remarks: 'Sample Remarks',
      createdBy: 'RM1',
      createdOn: new Date(),
      updatedOn: new Date(),
      status: 'A',
      customerName: 'Sample Customer',
      customerId: 'CB1',
      archiveFlag: 'false',
    };
    component.session = mockSession;
    component.deleteSession();
    expect(TestBed.inject(SessionService).deleteSession).toHaveBeenCalledWith(
      mockSession.sessionId
    );
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalled();
  });
});
