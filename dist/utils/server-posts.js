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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { readFile, readdir } from 'fs/promises';
var POSTS_DIRECTORY = process.env.BLOG_CONTENT_DIR
    ? path.join(process.cwd(), process.env.BLOG_CONTENT_DIR)
    : path.join(process.cwd(), 'content', 'posts');
export function getStaticPosts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getAllStaticPosts()];
        });
    });
}
export function getStaticPostBySlug(slug) {
    return __awaiter(this, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllStaticPosts()];
                case 1:
                    posts = _a.sent();
                    return [2 /*return*/, posts.find(function (post) { return post.slug === slug; }) || null];
            }
        });
    });
}
export function getStaticPreviousAndNextPosts(currentSlug) {
    return __awaiter(this, void 0, void 0, function () {
        var posts, currentIndex, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAllStaticPosts()];
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
export function getFeaturedStaticPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var allPosts, publishedPosts, seriesPosts, recentPosts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllStaticPosts()];
                case 1:
                    allPosts = _a.sent();
                    publishedPosts = filterPublishedPosts(allPosts);
                    seriesPosts = publishedPosts.filter(function (post) { return post.series; });
                    recentPosts = publishedPosts
                        .filter(function (post) { return !post.series; })
                        .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
                    return [2 /*return*/, __spreadArray(__spreadArray([], seriesPosts.slice(0, 2), true), recentPosts.slice(0, 2), true)];
            }
        });
    });
}
function getAllStaticPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var files_1, posts, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!fs.existsSync(POSTS_DIRECTORY)) {
                        console.error("Posts directory not found: ".concat(POSTS_DIRECTORY));
                        throw new Error('Posts directory not found');
                    }
                    return [4 /*yield*/, readdir(POSTS_DIRECTORY)];
                case 1:
                    files_1 = _a.sent();
                    if (files_1.length === 0) {
                        console.warn('No markdown files found in posts directory');
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, Promise.all(files_1
                            .filter(function (file) { return file.endsWith('.md'); })
                            .map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var filePath, content, _a, data, markdown;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        filePath = path.join(POSTS_DIRECTORY, file);
                                        return [4 /*yield*/, readFile(filePath, 'utf-8')];
                                    case 1:
                                        content = _c.sent();
                                        _a = matter(content), data = _a.data, markdown = _a.content;
                                        return [2 /*return*/, {
                                                id: path.basename(file, '.md'),
                                                title: data.title,
                                                slug: data.slug || path.basename(file, '.md'),
                                                date: new Date(data.date).toISOString(),
                                                publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : undefined,
                                                content: markdown,
                                                description: data.description || '',
                                                draft: data.draft || false,
                                                excerpt: data.excerpt || data.description || '',
                                                series: data.series ? {
                                                    name: data.series,
                                                    order: parseInt(((_b = data.title.match(/Part (\d+)/)) === null || _b === void 0 ? void 0 : _b[1]) || '1'),
                                                    totalParts: files_1.filter(function (f) {
                                                        return f.endsWith('.md') &&
                                                            matter(fs.readFileSync(path.join(POSTS_DIRECTORY, f), 'utf-8')).data.series === data.series;
                                                    }).length
                                                } : undefined
                                            }];
                                }
                            });
                        }); }))];
                case 2:
                    posts = _a.sent();
                    return [2 /*return*/, posts.sort(function (a, b) {
                            if (a.series && b.series && a.series.name === b.series.name) {
                                return a.series.order - b.series.order;
                            }
                            if (a.series && !b.series)
                                return -1;
                            if (!a.series && b.series)
                                return 1;
                            var dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
                            if (dateCompare !== 0)
                                return dateCompare;
                            return a.title.localeCompare(b.title);
                        })];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error in getAllStaticPosts:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function filterPublishedPosts(posts) {
    var now = new Date().toISOString();
    return posts.filter(function (post) {
        if (post.draft)
            return false;
        if (!post.publishDate)
            return true;
        return post.publishDate <= now;
    });
}
