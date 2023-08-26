import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_mesage';
export const ResponseMessage = (message: string) =>
      SetMetadata(RESPONSE_MESSAGE, message);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );

//   https://docs.nestjs.com/custom-decorators#param-decorators