var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var getBaseUrl = function () {
    if (typeof window !== 'undefined')
        return ''; // browser should use relative url
    if (process.env.VERCEL_URL)
        return "https://".concat(process.env.VERCEL_URL); // SSR should use vercel url
    return "http://localhost:".concat(process.env.PORT || 3003); // dev SSR should use localhost
};
export function getAllPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(getBaseUrl(), "/api/posts"), {
                        headers: { 'Content-Type': 'application/json' }
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to fetch posts');
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
export function getFeaturedPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(getBaseUrl(), "/api/posts?featured=true"), {
                        headers: { 'Content-Type': 'application/json' }
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to fetch featured posts');
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
export function searchPosts(query) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(getBaseUrl(), "/api/posts?q=").concat(encodeURIComponent(query)), {
                        headers: { 'Content-Type': 'application/json' }
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to search posts');
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
export function getPostBySlug(slug) {
    return __awaiter(this, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllPosts()];
                case 1:
                    posts = _a.sent();
                    return [2 /*return*/, posts.find(function (post) { return post.slug === slug; }) || null];
            }
        });
    });
}
export function getPreviousAndNextPosts(currentSlug) {
    return __awaiter(this, void 0, void 0, function () {
        var posts, currentIndex, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAllPosts()];
                case 1:
                    posts = _a.sent();
                    currentIndex = posts.findIndex(function (post) { return post.slug === currentSlug; });
                    if (currentIndex === -1) {
                        return [2 /*return*/, { previous: null, next: null }];
                    }
                    return [2 /*return*/, {
                            previous: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
                            next: currentIndex > 0 ? posts[currentIndex - 1] : null
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error getting previous and next posts:', error_1);
                    return [2 /*return*/, { previous: null, next: null }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
