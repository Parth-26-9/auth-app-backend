export class CommonResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}
