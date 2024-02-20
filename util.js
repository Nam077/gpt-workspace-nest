"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileTXT = exports.parseTimeToSeconds = void 0;
const fs = require("fs");
function parseTimeToSeconds(timeString) {
    const regex = /(\d+[Dd])?(\d+[Hh])?(\d+[Mm])?(\d+[Ss])?/;
    const matches = timeString.match(regex);
    if (!matches) {
        throw new Error('Invalid time format');
    }
    const days = parseInt(matches[1]?.replace(/[Dd]/g, '') || '0', 10);
    const hours = parseInt(matches[2]?.replace(/[Hh]/g, '') || '0', 10);
    const minutes = parseInt(matches[3]?.replace(/[Mm]/g, '') || '0', 10);
    const seconds = parseInt(matches[4]?.replace(/[Ss]/g, '') || '0', 10);
    const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
    return totalSeconds * 1000;
}
exports.parseTimeToSeconds = parseTimeToSeconds;
function readFileTXT(path) {
    const fileContent = fs.readFileSync(path, 'utf8');
    return fileContent.split('\n').filter((line) => line.trim() !== '');
}
exports.readFileTXT = readFileTXT;
//# sourceMappingURL=util.js.map