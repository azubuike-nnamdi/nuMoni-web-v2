import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // console.log('=== BRANCH API RECEIVED ===');
    // console.log('Complete Payload:', JSON.stringify(data, null, 2));
    // console.log('Form Data Keys:', Object.keys(data));
    // console.log('Total Fields:', Object.keys(data).length);
    // console.log('===========================');

    // Here you would typically save to your database
    // For now, we'll just return the data

    return NextResponse.json({
      success: true,
      message: 'Branch created successfully',
      data: data
    });

  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}
