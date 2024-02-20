import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
export interface User {
    email: string;
    name: string;
    owner: string;
}
export declare class GoogleSheet {
    private readonly configService;
    constructor(configService: ConfigService);
    private serviceAccountAuth;
    private initServiceAccountAuth;
    private doc;
    private initDoc;
    private getRows;
    groupByOwner(): Promise<Record<string, User[]>>;
    init(): Promise<void>;
}
