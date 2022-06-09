import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const User = createParamDecorator((data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    if (!request.user) throw new UnauthorizedException()

    return request.user
})