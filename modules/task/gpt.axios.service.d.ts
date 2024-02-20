import { User } from './google-sheet.servive';
import { Cookie } from '../cookie/entities/cookie.entity';
import { CookieService } from '../cookie/cookie.service';
export declare const chunk: <T>(array: T[], size: number) => T[][];
export interface UserData {
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
        picture: string;
        idp: string;
        iat: number;
        mfa: boolean;
        groups: string[];
        intercom_hash: string;
        account_id?: string;
    };
    expires: string;
    accessToken: string;
    authProvider: string;
    idGroup?: string;
}
export interface UserWorkSpace {
    id: string;
    email_address: string;
    role: string;
    name: string;
    created_time: string;
    email?: string;
}
export declare class GPTAPI {
    private readonly cookieService;
    private cookie;
    private MAIN_URL;
    private userData;
    constructor(cookie: Cookie, cookieService: CookieService);
    retryOperation(operation: () => Promise<any>, retryLimit?: number, delayTime?: number): Promise<any>;
    getSession(): Promise<any>;
    checkAccessToken(): Promise<any>;
    getGroupIdTeam(): Promise<void>;
    getUserMainWorkSpace(): Promise<any>;
    getPendingUserWorkSpace(): Promise<UserWorkSpace[] | undefined>;
    deleteUserMainWorkSpace(userWorkSpace: UserWorkSpace): Promise<void>;
    getEmailInvited(data: any): string[];
    deleteUserPendingWorkSpace(userWorkSpace: UserWorkSpace): Promise<void>;
    deleteUserMainWorkSpaceMulti(userWorkSpaces: UserWorkSpace[]): Promise<void>;
    deleteUserPendingWorkSpaceMulti(userWorkSpaces: UserWorkSpace[]): Promise<void>;
    getDefaultValue(): UserData;
    readJsonData(email: string): Promise<void>;
    processMainUser(usersSheet: Record<string, User[]>): Promise<{
        redundantMainUsers: UserWorkSpace[];
        redundantPendingUsers: UserWorkSpace[];
    }>;
    processMain(usersSheet: Record<string, User[]>): Promise<void>;
    checkIdGroup(): Promise<void>;
    inviteUserToWorkSpace(emails: string[]): Promise<void>;
    processInvite(usersSheet: Record<string, User[]>): Promise<void>;
}
