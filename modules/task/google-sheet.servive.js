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
exports.GoogleSheet = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const google_auth_library_1 = require("google-auth-library");
require("dotenv/config");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
let GoogleSheet = class GoogleSheet {
    constructor(configService) {
        this.configService = configService;
    }
    async initServiceAccountAuth(retry = 10) {
        try {
            this.serviceAccountAuth = new google_auth_library_1.JWT({
                email: this.configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
                key: this.configService.get('GOOGLE_PRIVATE_KEY'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        }
        catch (error) {
            if (retry <= 0) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
            console.log(`Retry to init service account auth: ${retry}`);
            await this.initServiceAccountAuth(retry - 1);
        }
    }
    async initDoc(id, retry = 10) {
        try {
            this.doc = new google_spreadsheet_1.GoogleSpreadsheet(id, this.serviceAccountAuth);
            await this.doc.loadInfo();
        }
        catch (error) {
            if (retry <= 0) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
            console.log(`Retry to init doc: ${retry}`);
            await this.initDoc(id, retry - 1);
        }
    }
    async getRows(retry = 10) {
        try {
            const users = [];
            const sheet = this.doc.sheetsByTitle[this.configService.get('GOOGLE_SHEET_TITLE')];
            const rows = await sheet.getRows();
            for (const row of rows) {
                if (!row.get('Owned'))
                    continue;
                users.push({
                    name: row.get('KHÁCH HÀNG'),
                    email: row.get('MAIL MEMBER'),
                    owner: row.get('Owned'),
                });
            }
            return users;
        }
        catch (error) {
            if (retry <= 0) {
                return undefined;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
            console.log(`Retry to get rows: ${retry}`);
            return await this.getRows(retry - 1);
        }
    }
    async groupByOwner() {
        console.log(`\n----------Get data from google sheet----------`);
        const users = await this.getRows();
        if (!users)
            return undefined;
        console.log(`----------End get data from google sheet----------\n`);
        return users.reduce((acc, user) => {
            if (!acc[user.owner]) {
                acc[user.owner] = [];
            }
            acc[user.owner].push(user);
            return acc;
        }, {});
    }
    async init() {
        try {
            await this.initServiceAccountAuth();
            await this.initDoc(this.configService.get('GOOGLE_SHEET_ID'));
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.GoogleSheet = GoogleSheet;
exports.GoogleSheet = GoogleSheet = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleSheet);
//# sourceMappingURL=google-sheet.servive.js.map