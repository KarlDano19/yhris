import { NextRequest, NextResponse } from 'next/server';

const TEMPLATE_ID = 'cmqrobgje00hw0j0xta5zjbfw';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.LOOPS_CALCULATOR_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Loops calculator API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionalId: TEMPLATE_ID,
        email: body.email,
        dataVariables: {
          FirstName: body.firstName,
          CompanyName: body.companyName,
          CalcTotalAnnualWaste: body.calcTotalAnnualWaste,
          CalcYahshuaSavings: body.calcYahshuaSavings,
          CalcMonthstoROI: body.calcMonthsToRoi,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Loops transactional email error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send transactional email', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error sending Loops transactional email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
