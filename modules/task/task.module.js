"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const task_controller_1 = require("./task.controller");
const config_1 = require("@nestjs/config");
const google_sheet_servive_1 = require("./google-sheet.servive");
const googlesheet_initializer_1 = require("./googlesheet.initializer");
const cookie_module_1 = require("../cookie/cookie.module");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({}), cookie_module_1.CookieModule],
        controllers: [task_controller_1.TaskController],
        providers: [task_service_1.TaskService, google_sheet_servive_1.GoogleSheet, googlesheet_initializer_1.GoogleSheetInitializer],
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map