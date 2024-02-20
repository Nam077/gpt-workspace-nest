import { CookieService } from './cookie.service';
import { CreateCookieDto } from './dto/create-cookie.dto';
export declare class CookieController {
    private readonly cookieService;
    constructor(cookieService: CookieService);
    add(): void;
    create(createCookieDto: CreateCookieDto): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    findAll(): Promise<{
        cookies: import("./entities/cookie.entity").Cookie[];
    }>;
    edit(id: string): Promise<{
        cookie: import("./entities/cookie.entity").Cookie;
    }>;
    update(id: string, updateCookieDto: CreateCookieDto): Promise<{
        cookie: import("./entities/cookie.entity").Cookie;
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        cookie?: undefined;
        success?: undefined;
    }>;
    delete(id: string): Promise<{
        cookie: void;
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        cookie?: undefined;
        success?: undefined;
    }>;
    findOne(id: string): Promise<import("./entities/cookie.entity").Cookie>;
}
