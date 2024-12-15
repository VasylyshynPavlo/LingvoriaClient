import { tokenService } from "./token.service";

export const accountService = {
    isAuthenticated() {
        return tokenService.get() !== null;
    },
    login(accessToken: string) {
        tokenService.save(accessToken);
    },
    logout() {
        tokenService.clear();
    }
}