"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCookieDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cookie_dto_1 = require("./create-cookie.dto");
class UpdateCookieDto extends (0, mapped_types_1.PartialType)(create_cookie_dto_1.CreateCookieDto) {
}
exports.UpdateCookieDto = UpdateCookieDto;
//# sourceMappingURL=update-cookie.dto.js.map