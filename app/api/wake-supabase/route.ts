import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return NextResponse.json({ status: 'error', message: 'Supabase URL not found' }, { status: 500 });
    }

    // Simple health check ping
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    });

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase ping successful',
      time: new Date().toISOString()
    });

  } catch (error) {
    console.error('Wake Supabase error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to ping Supabase' 
    }, { status: 500 });
  }
}