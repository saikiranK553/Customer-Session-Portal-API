import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SessionService } from '../../services/session-service/session.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IApiResponses, IResponseDto } from '../models/session.model';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteSessionComponent } from '../delete-session/delete-session.component';
import { ViewSessionComponent } from '../view-session/view-session.component';
import { NewSessionComponent } from '../new-session/new-session.component';

const sessionData = {
  sessionName: 'Mock Session 22',
  sessionId: '12345',
  remarks: 'This is a updated session',
  createdBy: 'Mock User',
  createdOn: new Date(),
  updatedOn: new Date(),
  status: 'Active',
  customerName: 'Mock Customer',
  customerId: '54321',
  archiveFlag: 'No',
};

describe('DashboardComponent', () => {
  const sessionServiceMock = {
    getSessions: jest
      .fn()
      .mockReturnValue(
        of<IApiResponses>({ session: [], totalElements: 0, totalPages: 0 })
      ),
    archiveSession: jest.fn(),
  };

  const toastrServiceMock = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const snackBarMock = {
    open: jest.fn(),
  };

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dialogRefSpy: { afterClosed: jest.Mock };
  let matDialogSpy: { open: jest.Mock };

  beforeEach(() => {
    dialogRefSpy = { afterClosed: jest.fn() };
    matDialogSpy = { open: jest.fn(() => dialogRefSpy) };
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, HeaderComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatTableModule,
        MatTabsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatToolbarModule,
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getActiveSessions when the active tab is changed', () => {
    const tabChangeEvent = { index: 0 } as MatTabChangeEvent;
    const sesionService = TestBed.inject(SessionService);
    component.onTabChange(tabChangeEvent);
    expect(sesionService.getSessions).toHaveBeenCalled();
  });

  it('should call getArchiveSessions when the active tab is changed', () => {
    const tabChangeEvent = { index: 1 } as MatTabChangeEvent;
    const sesionService = TestBed.inject(SessionService);
    component.onTabChange(tabChangeEvent);
    expect(sesionService.getSessions).toHaveBeenCalled();
  });

  it('should update currentPage and pageSize and call getData on onPageChange', () => {
    const pageEvent: PageEvent = {
      pageIndex: 2,
      pageSize: 20,
      length: 100,
    };
    const getDataSpy = jest.spyOn(component, 'getData');
    component.onPageChange(pageEvent);
    expect(component.currentPage).toBe(2);
    expect(component.pageSize).toBe(20);
    expect(getDataSpy).toHaveBeenCalled();
  });

  it('should handle HTTP 400 error by setting noSessions flag', () => {
    sessionServiceMock.getSessions.mockReturnValue(throwError({ status: 400 }));
    component.getData();
    expect(component.noSessions).toBe(true);
    expect(component.errorMessage).toBe(false);
  });

  it('should handle HTTP 500 error by setting errorMessage flag', () => {
    sessionServiceMock.getSessions.mockReturnValue(throwError({ status: 500 }));
    component.getData();
    expect(component.errorMessage).toBe(true);
  });

  it('should open the dialog with the correct data', () => {
    dialogRefSpy.afterClosed.mockReturnValue(of(sessionData));
    component.editSession(sessionData);
    expect(matDialogSpy.open).toHaveBeenCalledWith(EditSessionComponent, {
      width: '35%',
      data: sessionData,
    });
  });

  it('should call getData function if updatedSession is truthy', () => {
    dialogRefSpy.afterClosed.mockReturnValue(of(sessionData));
    const getDataSpy = jest.spyOn(component, 'getData');
    component.editSession(sessionData);
    expect(getDataSpy).toHaveBeenCalled();
  });

  it('should not call getData function if updatedSession is falsy', () => {
    dialogRefSpy.afterClosed.mockReturnValue(of(null));
    component.editSession(sessionData);
  });

  it('should open the dialog with the delete session data', () => {
    dialogRefSpy.afterClosed.mockReturnValue(of(sessionData));
    component.deleteSession(sessionData);
    expect(matDialogSpy.open).toHaveBeenCalledWith(DeleteSessionComponent, {
      width: '35%',
      data: sessionData,
    });
  });

  it('should not call getData function if deletesesion is falsy', () => {
    dialogRefSpy.afterClosed.mockReturnValue(of(null));
    component.deleteSession(sessionData);
  });

  it('should call getData function if deleteSession is truthy', () => {
    dialogRefSpy.afterClosed.mockReturnValue(of(sessionData));
    const getDataSpy = jest.spyOn(component, 'getData');
    component.deleteSession(sessionData);
    expect(getDataSpy).toHaveBeenCalled();
  });

  it('should call archiveSession and update the snackbar message', () => {
    const archiveSessionResponse: IResponseDto = {
      httpStatus: '200',
      sessionResponseDTO: sessionData,
      message: 'Session archived successfully',
    };
    sessionServiceMock.archiveSession.mockReturnValue(
      of(archiveSessionResponse)
    );
    component.archiveSession(sessionData);
    expect(sessionServiceMock.archiveSession).toHaveBeenCalledWith('12345');
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Session archived successfully',
      'Close',
      {
        duration: 4000,
      }
    );
  });

  it('should open the view session with the data', () => {
    component.viewSession(sessionData);
    expect(matDialogSpy.open).toHaveBeenCalledWith(ViewSessionComponent, {
      width: '32%',
      height: '60%',
      data: sessionData,
    });
  });

  it('should open the create session dialog and call getData when a session is created', () => {
    const dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };
    matDialogSpy.open.mockReturnValue(dialogRefMock);
    const getDataSpy = jest.spyOn(component, 'getData');
    component.createSessionDialog();
    expect(matDialogSpy.open).toHaveBeenCalledWith(NewSessionComponent, {
      width: '28%',
      height: 'auto',
    });
    expect(getDataSpy).toHaveBeenCalled();
  });

  it('should transform a session ID masked', () => {
    const sessionId1 = '1234567890';
    const transformedSessionId1 = component.transformSessionID(sessionId1);
    expect(transformedSessionId1).toBe('1234567890XXXX');
    const sessionId2 = '1';
    const transformedSessionId2 = component.transformSessionID(sessionId2);
    expect(transformedSessionId2).toBe('1');
  });

  it('should update active and archive tab values when tab is changed', () => {
    expect(component.activeSessionsTab).toBe(true);
    expect(component.archiveSessionsTab).toBe(false);
    const archiveTabChangeEvent = { index: 1 } as MatTabChangeEvent;
    component.onTabChange(archiveTabChangeEvent);
    expect(component.activeSessionsTab).toBe(false);
    expect(component.archiveSessionsTab).toBe(true);
    const activeTabChangeEvent = { index: 0 } as MatTabChangeEvent;
    component.onTabChange(activeTabChangeEvent);
    expect(component.activeSessionsTab).toBe(true);
    expect(component.archiveSessionsTab).toBe(false);
  });
});
