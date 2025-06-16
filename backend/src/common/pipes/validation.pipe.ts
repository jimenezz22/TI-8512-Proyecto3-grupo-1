import {
  ValidationPipe as NestValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export class CustomValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = this.buildErrorMessages(validationErrors);
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          details: errors,
        });
      },
    });
  }

  private buildErrorMessages(validationErrors: ValidationError[]): any[] {
    return validationErrors.map((error) => ({
      field: error.property,
      value: error.value,
      constraints: error.constraints,
      children: error.children?.length ? this.buildErrorMessages(error.children) : undefined,
    }));
  }
}