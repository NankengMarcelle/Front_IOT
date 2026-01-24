import { NextRequest, NextResponse } from 'next/server';

const PREDICTION_API_URL = process.env.NEXT_PUBLIC_PREDICTION_API_URL || 'https://crops-predictions.onrender.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { samples } = body;

        if (!samples || !Array.isArray(samples)) {
            return NextResponse.json(
                { error: 'Samples array is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${PREDICTION_API_URL}/predict/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ samples })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Prediction API returned ${response.status}` },
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
