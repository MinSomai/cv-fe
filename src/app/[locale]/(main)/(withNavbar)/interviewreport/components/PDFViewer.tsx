'use client';

import { Button } from '@/components/Button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import InterviewPDF from './InterviewPDF';

export function PDFDownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const ReactPDF = await import('@react-pdf/renderer');
      const doc = <InterviewPDF />;
      const blob = await ReactPDF.default.pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'interview_summary.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant='outline'
      onClick={handleGeneratePDF}
      className='flex justify-center  items-center h-10'
      disabled={isGenerating}>
      <Download className='mr-2 h-4 w-4' />
      {isGenerating ? 'Generating PDF...' : 'Download'}
    </Button>
  );
}
