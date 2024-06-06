import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewSessionComponent } from './view-session.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ISession } from '../models/session.model';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

const dialogRefMock = {
  close: jest.fn(),
};

describe('ViewSessionComponent', () => {
  let component: ViewSessionComponent;
  let fixture: ComponentFixture<ViewSessionComponent>;
  const mockSessionData: ISession = {
    sessionId: '1',
    customerName: 'Customer 1',
    createdBy: 'Admin',
    sessionName: 'Demo Session',
    remarks: 'This is a test session',
    createdOn: new Date(),
    updatedOn: new Date(),
    status: 'A',
    customerId: 'CB1',
    archiveFlag: 'false',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSessionComponent],
      imports: [MatToolbarModule, MatIconModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockSessionData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
      ],
    });
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ViewSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display session information correctly', () => {
    fixture.whenStable().then(() => {
      const sessionData = mockSessionData;
      const compiled = fixture.nativeElement;
      expect(
        compiled.querySelector('.info-value:nth-child(1)').textContent
      ).toContain(sessionData.sessionId);
      expect(
        compiled.querySelector('.info-value:nth-child(2)').textContent
      ).toContain(sessionData.customerName);
      expect(
        compiled.querySelector('.info-value:nth-child(3)').textContent
      ).toContain(sessionData.createdBy);
      expect(
        compiled.querySelector('.info-value:nth-child(4)').textContent
      ).toContain(sessionData.sessionName);
      expect(compiled.querySelector('textarea').value).toContain(
        sessionData.remarks
      );
    });
  });

  it('should close the dialog when onCancelClick is called', () => {
    component.onCancelClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
