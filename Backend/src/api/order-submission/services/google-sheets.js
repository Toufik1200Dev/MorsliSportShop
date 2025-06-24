'use strict';
const { google } = require('googleapis');
const path = require('path');

// NOTE: You will need to provide your own credentials and spreadsheet ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const KEY_FILE_PATH = 'C:\\Users\\rahma\\OneDrive\\Desktop\\fullMERN-ecommerce\\e-commerce\\Backend\\config\\google-credentials.json'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

class GoogleSheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
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