declare interface requestData {
  companyId: string;
  userId: string;
  [propName: string]: any;
}

declare interface responseData {
  code?: string;
  message?: string;
  success?: boolean;
  token: string;
  [propName: string]: any;
}
