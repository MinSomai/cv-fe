import { NextResponse } from 'next/server';
import ReactPDF from '@react-pdf/renderer';
// Use dynamic import for the PDF component
import InterviewPDF from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components/InterviewPDF';

export async function GET() {
  try {
    // Create the component before rendering
    // const MyDoc = () => <InterviewPDF />;
    // const pdfBuffer = await ReactPDF.renderToBuffer(<MyDoc />);

    return new NextResponse("<pdfBuffer>", {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="interview_summary.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
