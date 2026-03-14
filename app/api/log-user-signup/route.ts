import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, name, email, phone, street, area, pincode, status } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Missing required field: email' },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleDateString('en-IN');

    // Columns: Type | Name | Email | Phone | Street | Area | Pincode | Status | Date | Timestamp
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: 'Sheet1!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            type || 'login',
            name || '',
            email,
            phone || '',
            street || '',
            area || '',
            pincode || '',
            status || 'success',
            date,
            timestamp,
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Logged successfully',
      updatedRange: response.data.updates?.updatedRange,
    });
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return NextResponse.json(
      {
        error: 'Failed to log data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
