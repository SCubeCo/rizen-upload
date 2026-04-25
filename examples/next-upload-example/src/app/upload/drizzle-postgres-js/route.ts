import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
	const { nup } = await import('./nup');
	return nup.handler(request);
};

export const dynamic = 'force-dynamic';
