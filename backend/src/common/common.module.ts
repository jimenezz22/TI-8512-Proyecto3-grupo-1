import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { CustomValidationPipe } from './pipes/validation.pipe';

@Module({
  providers: [GlobalExceptionFilter, CustomValidationPipe],
  exports: [GlobalExceptionFilter, CustomValidationPipe],
})
export class CommonModule {}