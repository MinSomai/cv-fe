import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: '#344054',
  },
  banner: {
    backgroundColor: '#465ff1',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    width: '30%',
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#344054',
    marginBottom: 5,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 10,
    color: '#667085',
  },
  metricValue: {
    fontSize: 10,
    color: '#344054',
    fontWeight: 'bold',
  },
  insightsSection: {
    marginTop: 20,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#344054',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 10,
    color: '#667085',
  },
});

const InterviewGeneralPDF = () => (
  <View style={styles.section}>
    <View style={styles.banner}>
      <Text style={styles.bannerTitle}>You&apos;re on fire, Constantin!</Text>
      <Text style={styles.bannerText}>You&apos;ve improved by 10% since your last interview.</Text>
      <Text style={styles.bannerText}>
        🎯 Your Goal: Get promoted to a managerial position - you&apos;re absolutely crushing it, and should reach your goal
        in no time!
      </Text>
    </View>

    <View style={styles.metricsGrid}>
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Verbal Communication</Text>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Speech Clarity</Text>
          <Text style={styles.metricValue}>98%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Speech Flow</Text>
          <Text style={styles.metricValue}>34%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Use of Language</Text>
          <Text style={styles.metricValue}>58%</Text>
        </View>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Physical Presence</Text>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Eye Contact</Text>
          <Text style={styles.metricValue}>34%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Posture</Text>
          <Text style={styles.metricValue}>67%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Facial Expressions</Text>
          <Text style={styles.metricValue}>Positive</Text>
        </View>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Emotional Cues</Text>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Anxiety</Text>
          <Text style={styles.metricValue}>Low</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Intonation</Text>
          <Text style={styles.metricValue}>34%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Energy</Text>
          <Text style={styles.metricValue}>Positive</Text>
        </View>
      </View>
    </View>

    <View style={styles.insightsSection}>
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Key Strengths</Text>
        <Text style={styles.insightText}>• Clear and concise speech with minimal filler words</Text>
        <Text style={styles.insightText}>• Effective use of eye contact to engage the interviewer</Text>
        <Text style={styles.insightText}>• Confidence in answering technical questions with precise knowledge</Text>
      </View>
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Growth Opportunities</Text>
        <Text style={styles.insightText}>• Increase vocal variety to emphasize key points</Text>
        <Text style={styles.insightText}>• Reduce nervous gestures to improve overall body language</Text>
        <Text style={styles.insightText}>• Enhance response structure for more organized and impactful answers</Text>
      </View>
    </View>
  </View>
);

export default InterviewGeneralPDF;
