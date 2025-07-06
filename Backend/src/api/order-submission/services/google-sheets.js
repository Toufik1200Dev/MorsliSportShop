'use strict';
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// NOTE: You will need to provide your own credentials and spreadsheet ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

class GoogleSheetsService {
  constructor() {
    this.initialized = false;
    let credentials = null;
    
    // Try to get credentials from environment variable first (for production)
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
        console.log("Using Google credentials from environment variable");
      } catch (error) {
        console.warn("Could not parse GOOGLE_CREDENTIALS_JSON from environment:", error);
      }
    }
    
    // If no environment credentials, try to read from file (for development)
    if (!credentials) {
      try {
        const credentialsPath = path.resolve(__dirname, '../../../../config/google-credentials.json');
        credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        console.log("Using Google credentials from file");
      } catch (error) {
        console.warn("Could not read google-credentials.json. Google Sheets service is disabled.", error);
        return;
      }
    }
    
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
      });
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.initialized = true;
      console.log("Google Sheets service initialized successfully");
    } catch (error) {
      console.error("Could not initialize Google Sheets service:", error);
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