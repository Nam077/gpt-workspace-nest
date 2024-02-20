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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieController = void 0;
const common_1 = require("@nestjs/common");
const cookie_service_1 = require("./cookie.service");
const create_cookie_dto_1 = require("./dto/create-cookie.dto");
let CookieController = class CookieController {
    constructor(cookieService) {
        this.cookieService = cookieService;
    }
    add() {
        return;
    }
    async create(createCookieDto) {
        try {
            await this.cookieService.create(createCookieDto);
            return { success: true };
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async findAll() {
        const cookies = await this.cookieService.findAll();
        return { cookies };
    }
    async edit(id) {
        const cookie = await this.cookieService.findOne(+id);
        return { cookie };
    }
    async update(id, updateCookieDto) {
        try {
            const cookie = await this.cookieService.update(+id, updateCookieDto);
            return { cookie, success: true };
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async delete(id) {
        try {
            const cookie = await this.cookieService.remove(+id);
            return { cookie, success: true };
        }
        catch (error) {
            return { error: error.message };
        }
    }
    findOne(id) {
        return this.cookieService.findOne(+id);
    }
};
exports.CookieController = CookieController;
__decorate([
    (0, common_1.Get)('add'),
    (0, common_1.Render)('cookie/add'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CookieController.prototype, "add", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.Render)('cookie/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cookie_dto_1.CreateCookieDto]),
    __metadata("design:returntype", Promise)
], CookieController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('cookie/index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CookieController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:id/edit'),
    (0, common_1.Render)('cookie/edit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CookieController.prototype, "edit", null);
__decorate([
    (0, common_1.Post)('/:id/edit'),
    (0, common_1.Render)('cookie/edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cookie_dto_1.CreateCookieDto]),
    __metadata("design:returntype", Promise)
], CookieController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/:id/delete'),
    (0, common_1.Redirect)('/cookie'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CookieController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CookieController.prototype, "findOne", null);
exports.CookieController = CookieController = __decorate([
    (0, common_1.Controller)('cookie'),
    __metadata("design:paramtypes", [cookie_service_1.CookieService])
], CookieController);
//# sourceMappingURL=cookie.controller.js.map