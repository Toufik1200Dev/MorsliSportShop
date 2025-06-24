'use strict';
const { google } = require('googleapis');

// NOTE: You will need to provide your own credentials and spreadsheet ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

class GoogleSheetsService {
  constructor() {
    this.initialized = false;
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

    if (!credentialsJson) {
      console.warn("GOOGLE_CREDENTIALS_JSON environment variable not set. Google Sheets service is disabled.");
      return;
    }
    
    try {
      const credentials = JSON.parse(credentialsJson);
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
      });
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.initialized = true;
      console.log("Google Sheets service initialized successfully.");
    } catch (error) {
      console.error("Could not parse GOOGLE_CREDENTIALS_JSON or initialize Google Sheets service:", error);
    }
  }

  async appendRow(data) {
    if (!this.initialized) {
      throw new Error('Google Sheets service is not configured.');
    }

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