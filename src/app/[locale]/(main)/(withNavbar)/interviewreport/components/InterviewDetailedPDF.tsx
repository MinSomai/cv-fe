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
  questionCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  questionType: {
    fontSize: 10,
    color: '#667085',
  },
  questionText: {
    fontSize: 12,
    color: '#344054',
    marginTop: 5,
  },
  answerSection: {
    marginTop: 20,
  },
  answerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#344054',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 10,
    color: '#667085',
    marginBottom: 10,
  },
  feedbackItem: {
    marginBottom: 10,
  },
  feedbackTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#344054',
  },
  feedbackText: {
    fontSize: 10,
    color: '#667085',
  },
  metricsSection: {
    marginTop: 20,
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
});

const InterviewDetailedPDF = () => (
  <View style={styles.section}>
    <View style={styles.questionCard}>
      <Text style={styles.questionType}>Background</Text>
      <Text style={styles.questionText}>
        Could you please tell me about your academic background and your professional experience?
      </Text>
    </View>

    <View style={styles.answerSection}>
      <Text style={styles.answerTitle}>Your Answer</Text>
      <Text style={styles.answerText}>
        Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget
        vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu
        amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
      </Text>

      <View style={styles.feedbackItem}>
        <Text style={styles.feedbackTitle}>Relevance:</Text>
        <Text style={styles.feedbackText}>
          Your response was on-point, though adding specific examples could enhance depth and more personalization ex:
          you could add more examples, text and more text here.
        </Text>
      </View>

      <View style={styles.feedbackItem}>
        <Text style={styles.feedbackTitle}>Structure:</Text>
        <Text style={styles.feedbackText}>
          The answer followed a logical structure, but a clearer conclusion could improve impact personalization ex: you
          could add more examples, text and more text here.
        </Text>
      </View>

      <View style={styles.feedbackItem}>
        <Text style={styles.feedbackTitle}>Language:</Text>
        <Text style={styles.feedbackText}>
          Your language demonstrated knowledge, though a few more concise terms could boost clarity personalization ex:
          you could add more examples text here.
        </Text>
      </View>
    </View>

    <View style={styles.metricsSection}>
      <Text style={styles.answerTitle}>Verbal Communication</Text>
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
  </View>
);

export default InterviewDetailedPDF;
