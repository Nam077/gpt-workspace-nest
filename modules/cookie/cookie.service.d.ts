import { CreateCookieDto } from './dto/create-cookie.dto';
import { UpdateCookieDto } from './dto/update-cookie.dto';
import { Cookie } from './entities/cookie.entity';
import { Repository } from 'typeorm';
export declare class CookieService {
    private readonly cookieRepository;
    constructor(cookieRepository: Repository<Cookie>);
    checkExists(email: string): Promise<boolean>;
    create(createCookieDto: CreateCookieDto): Promise<Cookie>;
    findAll(): Promise<Cookie[]>;
    finAllNoError(): Promise<Cookie[]>;
    findOne(id: number): Promise<Cookie>;
    update(id: number, updateCookieDto: UpdateCookieDto): Promise<Cookie>;
    remove(id: number): Promise<void>;
    updateValueToError(email: string): Promise<void>;
}
