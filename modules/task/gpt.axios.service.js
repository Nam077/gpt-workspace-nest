"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPTAPI = exports.chunk = void 0;
const axios_1 = require("axios");
const fs = require("fs");
const cookie_entity_1 = require("../cookie/entities/cookie.entity");
const common_1 = require("@nestjs/common");
const cookie_service_1 = require("../cookie/cookie.service");
const cookieFile = 'cookie.txt';
if (!fs.existsSync(cookieFile)) {
    fs.writeFileSync(cookieFile, '');
}
function convertUserToListEmail(users) {
    return users.map((user) => user.email);
}
function findDifferencePendingUser(users, userWorkSpaces) {
    return userWorkSpaces.filter((user) => !users.some((u) => u.email === user.email_address));
}
function findDifferenceMainUser(users, userWorkSpaces) {
    return userWorkSpaces.filter((user) => !users.some((u) => u.email === user.email));
}
function removeUserAdminPending(userWorkSpaces, email) {
    return userWorkSpaces.filter((user) => user.email_address !== email);
}
function removeUserAdminMain(userWorkSpaces, email) {
    return userWorkSpaces.filter((user) => user.email !== email);
}
function findLostUsers(users, userWorkSpaces, pendingUsers) {
    return users.filter((user) => !userWorkSpaces.some((u) => u.email === user.email) &&
        !pendingUsers.some((u) => u.email_address === user.email));
}
const chunk = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};
exports.chunk = chunk;
const logFile = 'log.txt';
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
}
const writeFileLog = (message) => {
    const time = new Date().toLocaleString();
    fs.appendFileSync(logFile, `[ ${time} ]: ${message}\n`);
};
const writeFileLogCookie = (message) => {
    const time = new Date().toLocaleString();
    fs.appendFileSync(cookieFile, `[ ${time} ]: ${message}\n`);
};
function findTeamAccount(accounts) {
    for (const account_id of accounts.account_ordering) {
        const accountInfo = accounts.accounts[account_id].account;
        if (accountInfo.plan_type === 'team') {
            return accountInfo.account_id;
        }
    }
    return null;
}
function getHeader(data, mode) {
    const headers = {
        accept: '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
        'if-none-match': 'W/"9gu6jkqjnf1du"',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "YaBrowser";v="24.1", "Yowser";v="2.5"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/237.84.2.178 Safari/537.36',
        Referer: 'https://chat.openai.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    if (mode === 'cookie') {
        headers.Cookie = data.value;
    }
    if (mode === 'token') {
        headers.Authorization = `Bearer ${data.accessToken}`;
    }
    return headers;
}
let GPTAPI = class GPTAPI {
    constructor(cookie, cookieService) {
        this.cookieService = cookieService;
        this.MAIN_URL = 'https://chat.openai.com';
        this.cookie = cookie;
    }
    async retryOperation(operation, retryLimit = 5, delayTime = 1000) {
        for (let attempt = 1; attempt <= retryLimit; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                if (attempt === retryLimit) {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, delayTime));
                delayTime *= 1;
            }
        }
    }
    async getSession() {
        return await this.retryOperation(async () => {
            const url = `${this.MAIN_URL}/api/auth/session`;
            const { data } = await axios_1.default.get(url, {
                headers: getHeader(this.cookie, 'cookie'),
            });
            this.userData = data;
            fs.writeFileSync(`./data/${this.cookie.email}.json`, JSON.stringify(data));
            return data;
        }, 5, 1000).catch((error) => {
            throw new error();
        });
    }
    async checkAccessToken() {
        return await this.retryOperation(async () => {
            const url = `${this.MAIN_URL}/backend-api/me`;
            const { data } = await axios_1.default.get(url, {
                headers: getHeader(this.userData, 'token'),
            });
            this.userData = {
                user: data,
                expires: null,
                accessToken: null,
                authProvider: null,
            };
            return true;
        }, 1, 0).catch(async (error) => {
            return false;
        });
    }
    async getGroupIdTeam() {
        if (!(await this.checkAccessToken()) || !this.userData.accessToken) {
            try {
                await this.getSession();
            }
            catch (error) {
                console.log(error);
            }
        }
        await this.retryOperation(async () => {
            const url = `${this.MAIN_URL}/backend-api/accounts/check/v4-2023-04-27`;
            const { data } = await axios_1.default.get(url, {
                headers: getHeader(this.userData, 'token'),
            });
            this.userData.idGroup = findTeamAccount(data);
            fs.writeFileSync(`./data/${this.cookie.email}.json`, JSON.stringify(this.userData));
            return this.userData.idGroup;
        }).catch(async (error) => {
            writeFileLogCookie(`[${this.cookie.email}] DIE`);
            await this.cookieService.updateValueToError(this.cookie.email);
        });
    }
    async getUserMainWorkSpace() {
        return await this.retryOperation(async () => {
            const url = `${this.MAIN_URL}/backend-api/accounts/${this.userData.idGroup}/users`;
            const { data } = await axios_1.default.get(url, {
                headers: getHeader(this.userData, 'token'),
            });
            return data.items;
        }, 5, 1000).catch((error) => {
            return undefined;
        });
    }
    async getPendingUserWorkSpace() {
        try {
            return await this.retryOperation(async () => {
                const url = `${this.MAIN_URL}/backend-api/accounts/${this.userData.idGroup}/invites`;
                const { data } = await axios_1.default.get(url, {
                    headers: getHeader(this.userData, 'token'),
                });
                return data.items;
            }, 5, 1000);
        }
        catch (error) {
            return undefined;
        }
    }
    async deleteUserMainWorkSpace(userWorkSpace) {
        await this.retryOperation(async () => {
            const url = `${this.MAIN_URL}/backend-api/accounts/${this.userData.idGroup}/users/${userWorkSpace.id}`;
            const { data } = await axios_1.default.delete(url, {
                headers: getHeader(this.userData, 'token'),
            });
            const message = `[${this.userData.user.email}] [DELETE MAIN WORKSPACE] [${userWorkSpace.email}] ${JSON.stringify(data)}`;
            writeFileLog(message);
            console.log(message);
        }, 1, 1000).catch((error) => {
            throw error;
        });
    }
    getEmailInvited(data) {
        return data.account_invites.map((invite) => invite.email_address);
    }
    async deleteUserPendingWorkSpace(userWorkSpace) {
        await this.retryOperation(async () => {
            const url = `${this.MAIN_URL}/backend-api/accounts/${this.userData.idGroup}/invites`;
            const res = await axios_1.default.delete(url, {
                headers: getHeader(this.userData, 'token'),
                data: {
                    email_address: userWorkSpace.email_address,
                },
            });
            const message = `[${this.userData.user.email}] [DELETE PENDING WORKSPACE] ${userWorkSpace.email_address} ${JSON.stringify(res.data)}`;
            console.log(message);
            writeFileLog(message);
        }, 1, 1000).catch((error) => {
            throw error;
        });
    }
    async deleteUserMainWorkSpaceMulti(userWorkSpaces) {
        const tasks = userWorkSpaces.map((userWorkSpace) => {
            return this.deleteUserMainWorkSpace(userWorkSpace);
        });
        const chunks = (0, exports.chunk)(tasks, 10);
        for (const chunk of chunks) {
            await Promise.all(chunk);
        }
        return;
    }
    async deleteUserPendingWorkSpaceMulti(userWorkSpaces) {
        const tasks = userWorkSpaces.map((userWorkSpace) => {
            return this.deleteUserPendingWorkSpace(userWorkSpace);
        });
        const chunks = (0, exports.chunk)(tasks, 10);
        for (const chunk of chunks) {
            await Promise.all(chunk);
        }
        return;
    }
    getDefaultValue() {
        return {
            user: {
                id: '',
                name: '',
                email: this.cookie.email,
                image: '',
                picture: '',
                idp: '',
                iat: Date.now(),
                mfa: false,
                groups: [],
                intercom_hash: '',
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            accessToken: '',
            authProvider: '',
            idGroup: '',
        };
    }
    async readJsonData(email) {
        try {
            if (fs.existsSync(`./data/${email}.json`)) {
                this.userData = JSON.parse(fs.readFileSync(`./data/${email}.json`, 'utf8'));
            }
            else {
                this.userData = this.getDefaultValue();
            }
        }
        catch (error) {
            console.log(error);
            this.userData = this.getDefaultValue();
        }
    }
    async processMainUser(usersSheet) {
        const users = usersSheet[this.userData.user.email] || [];
        let redundantMainUsers = await this.getUserMainWorkSpace();
        if (redundantMainUsers) {
            redundantMainUsers = removeUserAdminMain(findDifferenceMainUser(users, redundantMainUsers), this.userData.user.email);
        }
        let redundantPendingUsers = await this.getPendingUserWorkSpace();
        if (redundantPendingUsers) {
            redundantPendingUsers = removeUserAdminPending(findDifferencePendingUser(users, redundantPendingUsers), this.userData.user.email);
        }
        return {
            redundantMainUsers,
            redundantPendingUsers,
        };
    }
    async processMain(usersSheet) {
        await this.readJsonData(this.cookie.email);
        try {
            await this.checkIdGroup();
            if (!this.userData.idGroup) {
                return;
            }
            console.log(`[PROCESS START] ${this.userData.user.email}`);
            const { redundantMainUsers, redundantPendingUsers } = await this.processMainUser(usersSheet);
            if (redundantMainUsers.length > 0) {
                await this.deleteUserMainWorkSpaceMulti(redundantMainUsers);
            }
            if (redundantPendingUsers.length > 0) {
                await this.deleteUserPendingWorkSpaceMulti(redundantPendingUsers);
            }
        }
        catch (error) {
            return;
        }
    }
    async checkIdGroup() {
        if (!this.userData.idGroup) {
            await this.getGroupIdTeam();
        }
    }
    async inviteUserToWorkSpace(emails) {
        return await this.retryOperation(async () => {
            const body = {
                email_addresses: emails,
                resend_emails: true,
                role: 'standard-user',
            };
            const url = `${this.MAIN_URL}/backend-api/accounts/${this.userData.idGroup}/invites`;
            const res = await axios_1.default.post(url, body, {
                headers: getHeader(this.userData, 'token'),
            });
            const message = `[${this.userData.user.email}] [INVITE MEMBER TO WORKSPACE] ${this.getEmailInvited(res.data).join(', ')}`;
            writeFileLog(message);
            return this.getEmailInvited(res.data);
        }, 1, 1000).catch((error) => {
        });
    }
    async processInvite(usersSheet) {
        await this.readJsonData(this.cookie.email);
        try {
            await this.checkIdGroup();
            if (!this.userData.idGroup) {
                return;
            }
            console.log(`[PROCESS START] ${this.userData.user.email}`);
            const mainUsers = await this.getUserMainWorkSpace();
            const pendingUsers = await this.getPendingUserWorkSpace();
            const lostUsers = findLostUsers(usersSheet[this.userData.user.email], mainUsers, pendingUsers);
            if (lostUsers.length > 0) {
                const emails = convertUserToListEmail(lostUsers);
                return await this.inviteUserToWorkSpace(emails);
            }
        }
        catch (error) {
            return;
        }
    }
};
exports.GPTAPI = GPTAPI;
exports.GPTAPI = GPTAPI = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cookie_entity_1.Cookie,
        cookie_service_1.CookieService])
], GPTAPI);
//# sourceMappingURL=gpt.axios.service.js.map