import { Injectable, Logger } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { coreApi } from "../../../integrations/api";
import { IntegrationException } from "../../../exceptions/integrationException";
import ICoreServiceIntegration from "./core.service.integration.contract";
import { LogoutRequest } from "./request/logout.request";
import { VerifyTokenResponse } from "./response/verifyToken.response";
import { GetAllUsersReponse } from "./response/getAllUsers.response";

@Injectable()
export class CoreServiceIntegration implements ICoreServiceIntegration {

    async getAllUsers(): Promise<GetAllUsersReponse[]> {
        try {
            const { data }: AxiosResponse<GetAllUsersReponse[]> = await coreApi().get("/users/all")
            "/api/kanbans"
            return data
        } catch (e) {
            new Logger("core service integration").error("get all users", e)
            this.error("[core service integration] get all users")
        }
    }

    async logout(payload: LogoutRequest): Promise<any> {
        try {
            const { data }: AxiosResponse<any> = await coreApi().post("/api/logout", payload)
            return data
        } catch (e) {
            new Logger("core service integration").error("user logout", e)
            this.error("[core service integration] user logout")
        }
    }

    async verifyToken(token: string): Promise<VerifyTokenResponse> {
        try {
            const { data }: AxiosResponse<VerifyTokenResponse> = await coreApi().post("/auth/verify", {token});
            return data
        } catch (e) {
            new Logger("core service integration").error("verify token", e)
            this.error("[core service integration] verify token")
        }
    }

    private error(e?: string) {
        throw new IntegrationException(e)
    }
}
