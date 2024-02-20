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
exports.CookieService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cookie_entity_1 = require("./entities/cookie.entity");
const typeorm_2 = require("typeorm");
let CookieService = class CookieService {
    constructor(cookieRepository) {
        this.cookieRepository = cookieRepository;
    }
    async checkExists(email) {
        const cookie = await this.cookieRepository.findOne({ where: { email } });
        return !!cookie;
    }
    async create(createCookieDto) {
        const { email } = createCookieDto;
        if (await this.checkExists(email)) {
            throw new common_1.ConflictException(`Email '${email}' is already associated with another cookie`);
        }
        const newCookie = this.cookieRepository.create(createCookieDto);
        return this.cookieRepository.save(newCookie);
    }
    async findAll() {
        return this.cookieRepository.find();
    }
    async finAllNoError() {
        return this.cookieRepository.find({
            where: {
                value: (0, typeorm_2.Not)((0, typeorm_2.Equal)('error')),
            },
        });
    }
    async findOne(id) {
        const cookie = await this.cookieRepository.findOne({ where: { id } });
        if (!cookie) {
            throw new common_1.NotFoundException(`Cookie with ID #${id} not found`);
        }
        return cookie;
    }
    async update(id, updateCookieDto) {
        const { email, ...rest } = updateCookieDto;
        const existingCookie = await this.findOne(id);
        if (email && email !== existingCookie.email) {
            const emailExists = await this.checkExists(email);
            if (emailExists) {
                throw new common_1.ConflictException(`Email '${email}' is already associated with another cookie`);
            }
        }
        this.cookieRepository.merge(existingCookie, { ...rest, email });
        return this.cookieRepository.save(existingCookie);
    }
    async remove(id) {
        const result = await this.cookieRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Cookie with ID #${id} not found`);
        }
    }
    async updateValueToError(email) {
        try {
            const cookie = await this.cookieRepository.findOne({ where: { email } });
            if (!cookie) {
                throw new common_1.NotFoundException(`Cookie with email '${email}' not found`);
            }
            cookie.value = 'error';
            await this.cookieRepository.save(cookie);
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.CookieService = CookieService;
exports.CookieService = CookieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cookie_entity_1.Cookie)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CookieService);
//# sourceMappingURL=cookie.service.js.map