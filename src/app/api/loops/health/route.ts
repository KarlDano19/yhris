/**
 * Health Check for Loops Integration
 * GET /api/loops/health
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.LOOPS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          error: 'API key not configured',
          timestamp: new Date().toISOString() 
        },
        { status: 500 }
      );
    }

    // Simple health check - just verify API key format
    const isValidKey = apiKey.length > 10 && apiKey.startsWith('loop_');
    
    if (!isValidKey) {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          error: 'Invalid API key format',
          timestamp: new Date().toISOString() 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      service: 'loops-integration',
      timestamp: new Date().toISOString(),
      endpoints: [
        '/api/loops/contacts',
        '/api/loops/contacts/update',
        '/api/loops/events'
      ]
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}
