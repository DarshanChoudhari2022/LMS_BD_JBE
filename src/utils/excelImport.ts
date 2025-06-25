import { read, utils } from 'xlsx';
import { Lead, Partner, Client, ImportResult } from '../types';

export const importExcelFile = async (file: File): Promise<ImportResult> => {
  try {
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return {
        success: false,
        message: 'No data found in the Excel file',
        errors: ['Empty file']
      };
    }

    // Validate and transform the data
    const transformedData = jsonData.map((row: any, index: number) => ({
      id: `imported-${Date.now()}-${index}`,
      ...row
    }));

    return {
      success: true,
      message: 'Data imported successfully',
      data: transformedData
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to import Excel file',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
};

export const validateLeadData = (data: any[]): Lead[] => {
  return data.map(row => ({
    id: row.id,
    status: row.Status || 'Live',
    name: row.Name || '',
    companyName: row['Company Name'] || '',
    phone: row['Phone mobile no'] || '',
    email: row.Email || '',
    productsServicesInterested: row['Products Services interested in'] || '',
    bdRepresentative: row['BD representative'] || '',
    dateOfLastContact: row['Date of last Contact'] || '',
    lastRemarks: row['last remarks'] || '',
    location: row.location || '',
    dateOfLeadAcquisition: row['date of lead acquisition'] || '',
    proposalShared: row['Proposal shared or no'] === 'Yes' ? 'Yes' : 'No',
    nextActionDate: row['Next action Date'] || ''
  }));
};

export const validatePartnerData = (data: any[]): Partner[] => {
  return data.map(row => ({
    id: row.id,
    engagementLetterSent: row['Engagement letter Sent?'] === 'Yes' ? 'Yes' : 'No',
    acceptanceStatus: row['Acceptance Status'] || '',
    engagementLetterReference: row['Engagement Letter Reference no'] || '',
    companyName: row['Company Name'] || '',
    contactPerson: row['Contact Person'] || '',
    natureOfContract: row['Nature Of Contract'] || '',
    bdRepresentative: row['BD Representative'] || '',
    contactNumber: row['Contact Number'] || '',
    status: row['Status'] || '',
    businessRemark: row['Business Remark'] || '',
    internalRemark: row['Internal Remark'] || ''
  }));
};

export const validateClientData = (data: any[]): Client[] => {
  return data.map(row => ({
    id: row.id,
    name: row.Name || '',
    companyName: row['Company Name'] || '',
    mobile: row.Mobile || '',
    email: row.Email || '',
    address: row.Address || '',
    bdRepresentative: row['BD Representative'] || '',
    city: row.City || '',
    country: row.Country || '',
    engagementDetails: row['Engagement Details'] || ''
  }));
};