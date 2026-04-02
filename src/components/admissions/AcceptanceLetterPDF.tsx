/**
 * Acceptance Letter PDF Document
 * Purpose: Render the official acceptance letter as a PDF
 * 
 * This component uses @react-pdf/renderer to create a professional
 * acceptance letter that can be downloaded by accepted students.
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register fonts (using standard fonts for PDF generation)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.woff2', fontWeight: 'bold' },
  ],
})

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a', // Dark blue
    paddingBottom: 20,
  },
  institutionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 5,
  },
  institutionAddress: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  date: {
    fontSize: 11,
    marginBottom: 30,
    color: '#333333',
  },
  recipient: {
    marginBottom: 20,
  },
  recipientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#1e1e1e',
  },
  recipientAddress: {
    fontSize: 10,
    color: '#666666',
  },
  greeting: {
    fontSize: 12,
    marginBottom: 15,
    color: '#1e1e1e',
  },
  body: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
  },
  listItem: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    marginLeft: 10,
    marginBottom: 3,
  },
  deadlineBox: {
    backgroundColor: '#fef3c7', // Light yellow
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b', // Amber
  },
  deadlineTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 5,
  },
  deadlineText: {
    fontSize: 10,
    color: '#92400e',
  },
  scholarshipBox: {
    backgroundColor: '#d1fae5', // Light green
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981', // Green
  },
  scholarshipTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 5,
  },
  scholarshipAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
  },
  signature: {
    marginTop: 40,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 5,
    width: 200,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  signatureTitle: {
    fontSize: 10,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
  },
  applicationId: {
    fontSize: 9,
    color: '#888888',
    textAlign: 'right',
    marginTop: 5,
  },
  // Status badge styles
  statusBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: 5,
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
})

// Types
interface AcceptanceLetterData {
  studentName: string
  firstName: string
  lastName: string
  email: string
  applicationId: number
  admissionType: string
  applicationTerm: string
  programOfInterest: string
  majorFirstChoice: string
  majorSecondChoice?: string
  acceptanceDate: Date
  enrollmentDeadline: Date
  responseRequiredBy: Date
  gpa?: number
  testScores?: {
    sat?: number
    act?: number
    gre?: number
    gmat?: number
  }
  scholarshipAmount?: number
  scholarshipType?: string
  financialAidOffered?: boolean
  tuitionAmount?: number
  institutionName: string
  institutionAbbr: string
  institutionAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  deanName: string
  deanTitle: string
  studentId?: string
  backgroundCheckCompleted?: boolean
}

/**
 * Acceptance Letter PDF Document
 */
export const AcceptanceLetterPDF: React.FC<{ data: AcceptanceLetterData }> = ({ data }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.institutionName}>{data.institutionName}</Text>
          <Text style={styles.institutionAddress}>
            {data.institutionAddress} • {data.city}, {data.state} {data.zipCode}
          </Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>{formatDate(data.acceptanceDate)}</Text>

        {/* Recipient */}
        <View style={styles.recipient}>
          <Text style={styles.recipientName}>{data.studentName}</Text>
          <Text style={styles.recipientAddress}>{data.email}</Text>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Dear {data.firstName} {data.lastName},</Text>

        {/* Acceptance Status Badge */}
        <View style={styles.statusBadge}>
          <Text>OFFICIAL NOTICE OF ADMISSION</Text>
        </View>

        {/* Main Content */}
        <Text style={styles.body}>
          On behalf of the Admissions Committee at {data.institutionAbbr}, I am delighted to 
          inform you that you have been{' '}
          <Text style={styles.highlight}>ADMITTED</Text> to{' '}
          {data.institutionName} for the {data.applicationTerm} semester!
        </Text>

        <Text style={styles.body}>
          After careful review of your application, academic records, and supporting documents, 
          the committee was impressed by your qualifications and potential to contribute to our 
          academic community. We believe you will thrive at {data.institutionAbbr} and make 
          meaningful contributions to your chosen field of study.
        </Text>

        {/* Program Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Details</Text>
          <Text style={styles.listItem}>
            <Text style={{ fontWeight: 'bold' }}>Program:</Text> {data.programOfInterest}
          </Text>
          <Text style={styles.listItem}>
            <Text style={{ fontWeight: 'bold' }}>Major:</Text> {data.majorFirstChoice}
          </Text>
          {data.majorSecondChoice && (
            <Text style={styles.listItem}>
              <Text style={{ fontWeight: 'bold' }}>Second Choice:</Text> {data.majorSecondChoice}
            </Text>
          )}
          <Text style={styles.listItem}>
            <Text style={{ fontWeight: 'bold' }}>Application ID:</Text> {data.applicationId}
          </Text>
          {data.studentId && (
            <Text style={styles.listItem}>
              <Text style={{ fontWeight: 'bold' }}>Student ID:</Text> {data.studentId}
            </Text>
          )}
        </View>

        {/* Academic Details */}
        {data.gpa && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Information</Text>
            <Text style={styles.listItem}>
              <Text style={{ fontWeight: 'bold' }}>GPA:</Text> {data.gpa.toFixed(2)}
            </Text>
            {data.testScores && (
              <>
                {data.testScores.sat && (
                  <Text style={styles.listItem}>
                    <Text style={{ fontWeight: 'bold' }}>SAT Score:</Text> {data.testScores.sat}
                  </Text>
                )}
                {data.testScores.act && (
                  <Text style={styles.listItem}>
                    <Text style={{ fontWeight: 'bold' }}>ACT Score:</Text> {data.testScores.act}
                  </Text>
                )}
                {data.testScores.gre && (
                  <Text style={styles.listItem}>
                    <Text style={{ fontWeight: 'bold' }}>GRE Score:</Text> {data.testScores.gre}
                  </Text>
                )}
                {data.testScores.gmat && (
                  <Text style={styles.listItem}>
                    <Text style={{ fontWeight: 'bold' }}>GMAT Score:</Text> {data.testScores.gmat}
                  </Text>
                )}
              </>
            )}
          </View>
        )}

        {/* Scholarship Information */}
        {data.financialAidOffered && (
          <View style={styles.scholarshipBox}>
            <Text style={styles.scholarshipTitle}>
              🎓 Financial Aid Award
            </Text>
            {data.scholarshipAmount && (
              <Text style={styles.scholarshipAmount}>
                {formatCurrency(data.scholarshipAmount)} {data.scholarshipType || 'Scholarship'}
              </Text>
            )}
            <Text style={{ fontSize: 10, color: '#065f46', marginTop: 5 }}>
              This scholarship is renewable based on academic performance.
            </Text>
          </View>
        )}

        {/* Deadline Box */}
        <View style={styles.deadlineBox}>
          <Text style={styles.deadlineTitle}>⚠️ Important Deadlines</Text>
          <Text style={styles.deadlineText}>
            <Text style={{ fontWeight: 'bold' }}>Enrollment Deadline:</Text> {formatDate(data.enrollmentDeadline)}
          </Text>
          <Text style={styles.deadlineText}>
            <Text style={{ fontWeight: 'bold' }}>Response Required By:</Text> {formatDate(data.responseRequiredBy)}
          </Text>
        </View>

        {/* Next Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text style={styles.listItem}>1. Accept or decline your offer through the student portal</Text>
          <Text style={styles.listItem}>2. Submit your enrollment deposit</Text>
          <Text style={styles.listItem}>3. Complete housing application (if applicable)</Text>
          <Text style={styles.listItem}>4. Submit final transcripts</Text>
          <Text style={styles.listItem}>5. Attend new student orientation</Text>
          <Text style={styles.listItem}>6. Register for classes</Text>
        </View>

        {/* Background Check */}
        {data.backgroundCheckCompleted !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Background Verification</Text>
            <Text style={styles.sectionContent}>
              {data.backgroundCheckCompleted 
                ? '✓ Your background verification has been completed successfully.'
                : '⏳ Your background verification is pending completion.'}
            </Text>
          </View>
        )}

        {/* Closing */}
        <Text style={styles.body}>
          We are excited to welcome you to the {data.institutionAbbr} community and look forward 
          to seeing you on campus!
        </Text>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.signatureName}>Sincerely,</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{data.deanName}</Text>
          <Text style={styles.signatureTitle}>{data.deanTitle}</Text>
          <Text style={styles.signatureTitle}>{data.institutionName}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.institutionAbbr} Admissions Office • admissions@{data.institutionAbbr.toLowerCase()}.edu
          </Text>
          <Text style={styles.footerText}>
            This is an official document. Please retain for your records.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default AcceptanceLetterPDF
