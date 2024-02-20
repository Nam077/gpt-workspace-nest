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
exports.GoogleSheetInitializer = void 0;
const common_1 = require("@nestjs/common");
const google_sheet_servive_1 = require("./google-sheet.servive");
let GoogleSheetInitializer = class GoogleSheetInitializer {
    constructor(googleSheet) {
        this.googleSheet = googleSheet;
    }
    async onModuleInit() {
        await this.googleSheet.init();
    }
};
exports.GoogleSheetInitializer = GoogleSheetInitializer;
exports.GoogleSheetInitializer = GoogleSheetInitializer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [google_sheet_servive_1.GoogleSheet])
], GoogleSheetInitializer);
//# sourceMappingURL=googlesheet.initializer.js.map