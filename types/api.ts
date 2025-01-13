export type ApiErrorCode = 
  | 'NETWORK_ERROR' 
  | 'API_ERROR' 
  | 'NOT_FOUND' 
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}