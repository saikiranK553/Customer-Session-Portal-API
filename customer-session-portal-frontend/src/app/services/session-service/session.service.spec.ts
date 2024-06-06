import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from './session.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  IApiResponses,
  ICreateSessionDto,
  IResponseDto,
  IUpdateSessionDto,
} from 'src/app/features/models/session.model';

const expectedResponse: IApiResponses = {
  totalElements: 2,
  totalPages: 1,
  session: [
    {
      sessionName: 'Session 1',
      sessionId: '1',
      remarks: 'Some remarks for session 1',
      createdBy: 'User A',
      createdOn: new Date('2023-09-08T12:00:00Z'),
      updatedOn: new Date('2023-09-08T14:30:00Z'),
      status: 'Active',
      customerName: 'Customer X',
      customerId: '101',
      archiveFlag: 'No',
    },
    {
      sessionName: 'Session 2',
      sessionId: '2',
      remarks: 'Some remarks for session 2',
      createdBy: 'User B',
      createdOn: new Date('2023-09-09T10:30:00Z'),
      updatedOn: new Date('2023-09-09T11:45:00Z'),
      status: 'Inactive',
      customerName: 'Customer Y',
      customerId: '102',
      archiveFlag: 'Yes',
    },
  ],
};

describe('SessionService', () => {
  let service: SessionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [SessionService],
    });
    service = TestBed.inject(SessionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call Api with parameters', () => {
    const status = 'A';
    const offset = 0;
    const pageSize = 2;
    const url = 'http://localhost:172.16.238.164/sessions';
    service.getSessions(status, offset, pageSize).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
    const expectedUrl = `${url}/${status}?pageNo=${offset}&pageSize=${pageSize}`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
  });

  it('should create session with API call', () => {
    const sessionData: ICreateSessionDto = {
      customerId: '12345',
      sessionName: 'mock session',
      remarks: 'mock remarks',
      createdBy: 'Ram',
    };
    const mockResponse: IResponseDto = {
      message: 'Session created successfully',
      httpStatus: '200',
      sessionResponseDTO: {
        sessionName: 'mock session',
        sessionId: '2',
        remarks: 'mock remarks',
        createdBy: 'Ram',
        createdOn: new Date('2023-09-09T10:30:00Z'),
        updatedOn: new Date('2023-09-09T11:45:00Z'),
        status: 'Inactive',
        customerName: 'Customer Y',
        customerId: '12345',
        archiveFlag: 'No',
      },
    };
    const url = 'http://localhost:172.16.238.164/sessions';
    service.createSession(sessionData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const request = httpTestingController.expectOne(url);
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
  });

  it('should call Delete session Api', () => {
    const expectedResponse: IResponseDto = {
      message: 'Session Deleted successfully',
      httpStatus: '200',
      sessionResponseDTO: {
        sessionName: 'mock session',
        sessionId: '12345',
        remarks: 'mock remarks',
        createdBy: 'Ram',
        createdOn: new Date('2023-09-09T10:30:00Z'),
        updatedOn: new Date('2023-09-09T11:45:00Z'),
        status: 'Inactive',
        customerName: 'Customer Y',
        customerId: '12345',
        archiveFlag: 'No',
      },
    };
    const sessionId = '12345';
    const url = 'http://localhost:172.16.238.164/sessions';
    const expectedUrl = `${url}/${sessionId}`;
    service.deleteSession(sessionId).subscribe((response) => {
      expect(response.sessionResponseDTO.sessionId).toEqual(sessionId);
    });
    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toEqual('DELETE');
    request.flush(expectedResponse);
  });

  it('shoul call Archive Session APi', () => {
    const sessionId = '123456';
    const url = 'http://localhost:172.16.238.164/sessions';
    const expectedUrl = `${url}/${'archive'}/${sessionId}`;
    const expectedResponse: IResponseDto = {
      message: 'Session Deleted successfully',
      httpStatus: '200',
      sessionResponseDTO: {
        sessionName: 'mock session',
        sessionId: '12345',
        remarks: 'mock remarks',
        createdBy: 'Ram',
        createdOn: new Date('2023-09-09T10:30:00Z'),
        updatedOn: new Date('2023-09-09T11:45:00Z'),
        status: 'Inactive',
        customerName: 'Customer Y',
        customerId: '12345',
        archiveFlag: 'No',
      },
    };
    service.archiveSession(sessionId).subscribe((res) => {
      expect(res).toBe(expectedResponse);
    });
    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toEqual('PUT');
    request.flush(expectedResponse);
  });

  it('should call update session API', () => {
    const sessionId = '123456';
    const mockUpdateRespone: IUpdateSessionDto = {
      remarks: 'jwgfwjfw',
      sessionName: 'Ramusus',
    };
    const mockResponse: IResponseDto = {
      message: 'Session Updated successfully',
      httpStatus: '200',
      sessionResponseDTO: {
        sessionName: 'mock session',
        sessionId: '123456',
        remarks: 'mock remarks',
        createdBy: 'Ram',
        createdOn: new Date('2023-09-09T10:30:00Z'),
        updatedOn: new Date('2023-09-09T11:45:00Z'),
        status: 'Inactive',
        customerName: 'Customer Y',
        customerId: '12345',
        archiveFlag: 'No',
      },
    };
    const url = 'http://localhost:172.16.238.164/sessions';
    const expectedUrl = `${url}/${sessionId}`;
    service.updateSession(sessionId, mockUpdateRespone).subscribe((res) => {
      expect(res).toBe(mockResponse);
    });
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockResponse);
  });
});
