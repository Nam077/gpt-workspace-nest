import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GoogleSheet } from './google-sheet.servive';
import { CookieService } from '../cookie/cookie.service';
import { ConfigService } from '@nestjs/config';
export declare class TaskService {
    private readonly googleSheet;
    private readonly cookieService;
    private readonly configService;
    private isScanning;
    constructor(googleSheet: GoogleSheet, cookieService: CookieService, configService: ConfigService);
    create(createTaskDto: CreateTaskDto): string;
    findAll(): Promise<string>;
    scan(): Promise<void>;
    invite(): Promise<any[]>;
    findOne(id: number): string;
    update(id: number, updateTaskDto: UpdateTaskDto): string;
    remove(id: number): string;
    log(): {
        class: string;
        message: string;
    }[];
}
