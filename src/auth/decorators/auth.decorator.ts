import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

export const GUEST_KEY = Symbol("GUEST_KEY")

// authenticates jwt token and set request user
// also sets GUEST_KEY metadata to false to allow authenticated route handlers inside of guest controllers
export const Auth = () => applyDecorators(
    UseGuards(JwtAuthGuard),
    SetMetadata(GUEST_KEY, false)
)

// sets GUEST_KEY to true to skip authentication for route
// request user becomes undefined
export const Guest = () => SetMetadata(GUEST_KEY, true)