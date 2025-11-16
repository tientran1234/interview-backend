import { JwtPayload } from "jsonwebtoken"

export interface TokenPayload extends JwtPayload {
    user_id: string
    exp: number,
    role: string
    iat: number
}
export interface LogoutReqBody {
    refresh_token: string
}

export interface RefreshTokenReqBody {
    refresh_token: string
}
