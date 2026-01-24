import { NextRequest, NextResponse } from 'next/server';

const EXPERT_API_URL = process.env.NEXT_PUBLIC_EXPERT_SYSTEM_API_URL || 'https://systeme-expert-5iyu.onrender.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${EXPERT_API_URL}/api/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Expert System returned ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
