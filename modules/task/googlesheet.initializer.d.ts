import { OnModuleInit } from '@nestjs/common';
import { GoogleSheet } from './google-sheet.servive';
export declare class GoogleSheetInitializer implements OnModuleInit {
    private readonly googleSheet;
    constructor(googleSheet: GoogleSheet);
    onModuleInit(): Promise<void>;
}
