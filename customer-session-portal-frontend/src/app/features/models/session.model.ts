export interface IUpdateSessionDto {
  sessionName: string;
  remarks: string;
}

export interface IResponseDto {
  message: string;
  httpStatus: string;
  sessionResponseDTO: ISession;
}

export interface ICreateSessionDto {
  customerId: string;
  sessionName: string;
  remarks: string;
}
export interface IResponseDto {
  message: string;
  httpStatus: string;
  sessionResponseDTO: ISession;
}

export interface ICreateSessionDto{
  customerId:string;
  sessionName:string;
  remarks:string;
  createdBy:string;
}
export interface ISession {
  sessionName: string;
  sessionId: string;
  remarks: string;
  createdBy: string;
  createdOn: Date;
  updatedOn: Date;
  status: string;
  customerName: string;
  customerId: string;
  archiveFlag: string;
}

export interface IUserData {
  username: string;
  password: string;
}

export interface IApiResponses {
  totalElements: number;
  totalPages: number;
  session: ISession[];
}
