import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email } = await request.json();
    
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const privyAppSecret = process.env.NEXT_PUBLIC_PRIVY_APP_SECRET;

    if (!privyAppId || !privyAppSecret) {
        console.error('Privy app ID or secret is missing');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch('https://auth.privy.io/api/v1/users', {
        method: 'POST',
        headers: {
            'privy-app-id': privyAppId,
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64'),
        },
        body: JSON.stringify({
            create_ethereum_wallet: true,
            linked_accounts: [{ address: email, type: 'email' }],
        }),
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
}