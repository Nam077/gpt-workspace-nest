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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const google_sheet_servive_1 = require("./google-sheet.servive");
const cookie_service_1 = require("../cookie/cookie.service");
const gpt_axios_service_1 = require("./gpt.axios.service");
const config_1 = require("@nestjs/config");
const util_1 = require("../../util");
let TaskService = class TaskService {
    constructor(googleSheet, cookieService, configService) {
        this.googleSheet = googleSheet;
        this.cookieService = cookieService;
        this.configService = configService;
        this.isScanning = false;
    }
    create(createTaskDto) {
        return 'This action adds a new task';
    }
    async findAll() {
        console.log('Running..');
        if (!this.isScanning) {
            await this.scan();
            this.isScanning = true;
            const checkTimeInterval = (0, util_1.parseTimeToSeconds)(this.configService.get('CHECK_TIME') || '50s');
            setInterval(async () => {
                await this.scan();
            }, checkTimeInterval);
        }
        return 'This action returns all tasks';
    }
    async scan() {
        const record = await this.googleSheet.groupByOwner();
        const task = [];
        const cookies = await this.cookieService.finAllNoError();
        for (const cookie of cookies) {
            const gptAPI = new gpt_axios_service_1.GPTAPI(cookie, this.cookieService);
            task.push(gptAPI.processMain(record));
        }
        const taskChunks = (0, gpt_axios_service_1.chunk)(task, 3);
        for (const chunk of taskChunks) {
            await Promise.all(chunk);
        }
    }
    async invite() {
        const record = await this.googleSheet.groupByOwner();
        const task = [];
        const cookies = await this.cookieService.finAllNoError();
        for (const cookie of cookies) {
            const gptAPI = new gpt_axios_service_1.GPTAPI(cookie, this.cookieService);
            task.push(gptAPI.processInvite(record));
        }
        const result = [];
        const taskChunks = (0, gpt_axios_service_1.chunk)(task, 3);
        for (const chunk of taskChunks) {
            result.push(...(await Promise.all(chunk)));
        }
        const finalResult = [];
        for (const item of result) {
            if (item) {
                finalResult.push(...item);
            }
        }
        return finalResult;
    }
    findOne(id) {
        return `This action returns a #${id} task`;
    }
    update(id, updateTaskDto) {
        return `This action updates a #${id} task`;
    }
    remove(id) {
        return `This action removes a #${id} task`;
    }
    log() {
        return (0, util_1.readFileTXT)('log.txt').map((item) => {
            if (item.includes('DELETE')) {
                return {
                    class: 'alert-danger',
                    message: item,
                };
            }
            else if (item.includes('INVITE')) {
                return {
                    class: 'alert-info',
                    message: item,
                };
            }
            else {
                return {
                    class: 'alert-success',
                    message: item,
                };
            }
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [google_sheet_servive_1.GoogleSheet,
        cookie_service_1.CookieService,
        config_1.ConfigService])
], TaskService);
//# sourceMappingURL=task.service.js.map