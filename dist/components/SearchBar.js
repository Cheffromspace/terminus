"use client";
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
import React, { useState, useCallback, useEffect } from "react";
import { searchPosts } from "@/utils/posts";
import Link from "next/link";
export default function SearchBar() {
    var _this = this;
    var _a = useState(""), query = _a[0], setQuery = _a[1];
    var _b = useState([]), results = _b[0], setResults = _b[1];
    var _c = useState(false), isSearching = _c[0], setIsSearching = _c[1];
    var handleSearch = useCallback(function (searchQuery) { return __awaiter(_this, void 0, void 0, function () {
        var searchResults, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!searchQuery.trim()) {
                        setResults([]);
                        return [2 /*return*/];
                    }
                    setIsSearching(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, searchPosts(searchQuery)];
                case 2:
                    searchResults = _a.sent();
                    setResults(searchResults);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Search error:", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSearching(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    useEffect(function () {
        var debounceTimer = setTimeout(function () {
            handleSearch(query);
        }, 300);
        return function () { return clearTimeout(debounceTimer); };
    }, [query, handleSearch]);
    return (React.createElement("div", { className: "relative w-full max-w-2xl mx-auto" },
        React.createElement("input", { type: "text", value: query, onChange: function (e) { return setQuery(e.target.value); }, placeholder: "Search posts...", className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", "data-nav-item": true }),
        query.trim() && (React.createElement("div", { className: "absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto" }, isSearching ? (React.createElement("div", { className: "p-4 text-center text-gray-500" }, "Searching...")) : results.length > 0 ? (React.createElement("ul", null, results.map(function (post) { return (React.createElement("li", { key: post.slug },
            React.createElement(Link, { href: "/posts/".concat(post.slug), className: "block p-4 hover:bg-gray-50", "data-nav-item": true },
                React.createElement("h3", { className: "font-medium" }, post.title),
                post.description && (React.createElement("p", { className: "mt-1 text-sm text-gray-600" }, post.description))))); }))) : (React.createElement("div", { className: "p-4 text-center text-gray-500" }, "No posts found"))))));
}
