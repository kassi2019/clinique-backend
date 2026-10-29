"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onglet = exports.ONGLET_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ONGLET_KEY = 'onglets';
const Onglet = (...codes) => (0, common_1.SetMetadata)(exports.ONGLET_KEY, codes);
exports.Onglet = Onglet;
//# sourceMappingURL=onglet.decorator.js.map