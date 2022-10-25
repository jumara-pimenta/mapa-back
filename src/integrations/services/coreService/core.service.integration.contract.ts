import { LogoutRequest } from "./request/logout.request";
import { GetAllUsersReponse } from "./response/getAllUsers.response";
import { VerifyTokenResponse } from "./response/verifyToken.response";

export default interface ICoreServiceIntegration {
    logout(payload: LogoutRequest): Promise<any>
    verifyToken(token: string): Promise<VerifyTokenResponse>
    getAllUsers(): Promise<GetAllUsersReponse[]>
}
