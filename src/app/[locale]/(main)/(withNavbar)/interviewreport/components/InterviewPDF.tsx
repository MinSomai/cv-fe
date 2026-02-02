'use client';

import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import InterviewGeneralPDF from './InterviewGeneralPDF';
import InterviewDetailedPDF from './InterviewDetailedPDF';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#F9FAFB',
    padding: 30,
  },
});

function InterviewPDF() {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <InterviewGeneralPDF />
      </Page>
      <Page size='A4' style={styles.page}>
        <InterviewDetailedPDF />
      </Page>
    </Document>
  );
}

export default InterviewPDF;
