export class TokenEntity {
    accessToken!: string;

    constructor(token: TokenEntity) {
        Object.assign(this, token)
    }
}