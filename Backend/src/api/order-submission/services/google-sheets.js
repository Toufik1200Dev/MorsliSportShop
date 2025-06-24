'use strict';
const { google } = require('googleapis');

// NOTE: You will need to provide your own credentials and spreadsheet ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Parse the credentials from the environment variable
let credentials;
try {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
} catch (error) {
  console.error("Could not parse GOOGLE_CREDENTIALS_JSON:", error);
  // Handle the error appropriately. For example, by throwing it
  // or by setting credentials to null and handling that case below.
  throw new Error("Invalid GOOGLE_CREDENTIALS_JSON environment variable.");
}

class GoogleSheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async appendRow(data) {
    const resource = {
      values: [data],
    };

    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Feuille 1!A1', // Assumes your sheet is named 'Feuille 1'
        valueInputOption: 'USER_ENTERED',
        requestBody: resource,
      });
      return response.data;
    } catch (error) {
      console.error('Error appending data to Google Sheet:', error.message);
      throw new Error('Failed to append data to Google Sheet.');
    }
  }
}

module.exports = new GoogleSheetsService(); 