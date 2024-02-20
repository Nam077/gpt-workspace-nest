"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const expressHandlebars = require("express-handlebars");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const FOLDER_DATA = 'data';
if (!fs.existsSync(FOLDER_DATA)) {
    fs.mkdirSync(FOLDER_DATA);
}
fs.readdir(FOLDER_DATA, (err, files) => {
    if (err)
        throw err;
    for (const file of files) {
        fs.unlink(`${FOLDER_DATA}/${file}`, (err) => {
            if (err)
                throw err;
        });
    }
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.engine('hbs', expressHandlebars.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: (0, path_1.join)(__dirname, '..', 'views', 'layouts'),
        partialsDir: (0, path_1.join)(__dirname, '..', 'views', 'partials'),
    }));
    app.setViewEngine('hbs');
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map