import { NextResponse } from 'next/server';
export declare function GET(request: Request): Promise<NextResponse<import("../../../types/blog").Post[]> | NextResponse<{
    error: string;
}>>;
