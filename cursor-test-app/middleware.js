import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request) {
  // Only protect /protected routes
  if (request.nextUrl.pathname.startsWith('/protected')) {
    // Get the API key from the session storage
    const apiKey = request.cookies.get('validApiKey')?.value;

    if (!apiKey) {
      // Redirect to playground if no API key is found
      return NextResponse.redirect(new URL('/playground', request.url));
    }

    try {
      // Initialize Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // Verify the API key
      const { data, error } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key', apiKey)
        .single();

      if (error || !data) {
        // Clear invalid API key and redirect to playground
        const response = NextResponse.redirect(new URL('/playground', request.url));
        response.cookies.delete('validApiKey');
        return response;
      }

      // API key is valid, allow access
      return NextResponse.next();
    } catch (error) {
      // Handle any errors by redirecting to playground
      return NextResponse.redirect(new URL('/playground', request.url));
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: '/protected/:path*'
}; 