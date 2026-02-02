"use client";

import React, { useEffect, useCallback, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";

import { Button } from "@/components/Button";
import { Download, Share2, User, Calendar, Clock, Home } from "lucide-react";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { CareerProfile } from "./components/CareerProfile";
import { CareerValuesMotivators } from "./components/CareerValuesMotivators";
import { SkillsAssessment } from "./components/SkillsAssessment";
import { WorkEnvironmentPreferences } from "./components/WorkEnvironmentPreferences";
import { CareerPathwayRecommendations } from "./components/CareerPathwayRecommendations";
import { DevelopmentRoadmap } from "./components/DevelopmentRoadmap";
import { AddressingKeyChallenges } from "./components/AddressingKeyChallenges";
import { GrowthOpportunities } from "./components/CareerGrowthOpportunities";
import { MethodologyReferences } from "./components/MethodologyReferences";
import { CareerReport as ICareerReport } from "@/utils/types";
import { rest } from "@/lib/rest";
import Loading from "@/components/Loading";

// Mock data for all sections
// const mockReportData: ICareerReport = {
//   userName: "Constantin Solovei",
//   status: "Preparing for Career Entry",
//   date: "October 31, 2024",
//   time: "12:00 PM",
//   analytics: {
//     executiveSummary: {
//       description:
//         "Your assessment reveals a Social-Enterprising-Conventional (SEC) profile with particular strengths in strategic communication and collaborative leadership. Your career alignment shows strongest potential",
//       metrics: {
//         careerPathwaysMatch: {
//           overallScore: 65, // Average of all pathway matches
//           organizationalDevelopmentConsultant: 98,
//           learningDevelopmentManager: 34,
//           hrBusinessPartner: 58,
//         },
//       },
//       priorityDevelopmentAreas: [
//         "Data analytics fundamentals",
//         "Project management methodology",
//         "Industry-specific knowledge",
//       ],
//       longTermTrajectory:
//         "Your profile indicates potential for senior leadership in organizational development contexts within 5-10 years, aligned with your aspirations for creating developmental impact at scale.",
//       estimatedTransitionTimeline:
//         "6-9 months for initial career transition; 3-5 years to advance to senior leadership positions with focused development",
//       riasecProfile: {
//         values: [45, 60, 35, 85, 75, 55], // R, I, A, S, E, C values
//       },
//     },
//     careerProfile: {
//       hollandCode: {
//         code: "SEC",
//         social: 78,
//         enterprising: 65,
//         conventional: 48,
//       },
//       meaning: [
//         "Social (78%): You thrive in roles focused on teaching, mentoring, and collaborative problem-solving",
//         "Enterprising (65%): You show capability for leadership, strategic planning, and organizational influence",
//         "Conventional (48%): You have a moderate appreciation for structured processes and systems",
//       ],
//       bestFitFields: [
//         "Organizational development",
//         "Corporate training",
//         "Human resources management",
//       ],
//       cognitiveApproach:
//         "Your Collaborative-Integrative problem-solving style and Growth-Oriented feedback approach indicate particular strength in roles requiring stakeholder management and continuous learning environments",
//     },
//     careerValuesMotivators: {
//       description:
//         "Your assessment reveals a Social-Enterprising-Conventional (SEC) profile with particular strengths in strategic communication and collaborative leadership. Your career alignment shows strongest potential",
//       metrics: {
//         careerDecisionsAreDrivenBy: {
//           overallScore: 74, // Average of all career decisions
//           positiveImpactOnOthers: 98,
//           workLifeBalance: 78,
//           continuousLearning: 75,
//           professionalRecognition: 62,
//           financialRewards: 58,
//         },
//       },
//       primaryMotivators: [
//         "<strong>Purpose-Driven Work</strong>: Making meaningful differences in others' careers and lives",
//         "Continuous Development: Ongoing learning and skill acquisition",
//       ],
//       practicalApplications: [
//         "Your emphasis on Positive Impact (85%) suggests roles with clear social benefit will provide greatest satisfaction",
//         "Your strong Work-Life Balance (78%) value indicates hybrid or flexible work arrangements will be crucial for long-term engagement",
//         "Your priority on Continuous Learning (75%) points to environments with professional development opportunities and growth paths",
//       ],
//       idealOrganizationalCultures:
//         "Mission-driven organizations that value both impact and work-life harmony",
//       emotionalAnalysis: {
//         values: [0.8, 0.9, 0.7, 0.3, 0.4, 0.2],
//       },
//     },
//     skillsAssessment: {
//       coreStrengths: [
//         { skill: "Interpersonal Communication", rating: 5 },
//         { skill: "Continuous Learning", rating: 5 },
//       ],
//       emergingStrengths: [
//         { skill: "Strategic Analysis", rating: 4 },
//         { skill: "Organizational Leadership", rating: 3 },
//         { skill: "Change Management", rating: 3 },
//       ],
//       developmentPriorities: [
//         {
//           skill: "Data Analysis",
//           rating: 2,
//           priority: "High priority",
//           learningPeriod: "2-3 months with targeted courses",
//         },
//         {
//           skill: "Technical Domain Knowledge",
//           rating: 2,
//           priority: "High priority",
//           learningPeriod: "3-4 months with certification",
//         },
//         {
//           skill: "Project Management",
//           rating: 2,
//           priority: "Secondary focus",
//           learningPeriod: "1-2 months for fundamentals",
//         },
//       ],
//       skillsMatrix: {
//         columns: [
//           "Problem solving",
//           "Applying quantitative reasoning",
//           "Acquiring major scientific concepts",
//           "Decision making based on evidence",
//           "Developing creativity and innovation",
//           "Understanding how science applies to everyday life",
//           "Scientific writing",
//           "Memorizing some basic facts",
//           "Remembering formulas, structures, and procedures",
//           "Working in groups",
//         ],
//         rows: [
//           {
//             title: "Biological Sciences",
//             count: "(n=1329)",
//             values: [88, 75, 92, 87, 76, 84, 67, 64, 46, 46],
//           },
//           {
//             title: "Chemistry",
//             count: "(n=245)",
//             values: [82, 87, 94, 80, 71, 80, 78, 53, 48, 41],
//           },
//           {
//             title: "Physics",
//             count: "(n=114)",
//             values: [86, 95, 92, 81, 76, 67, 57, 40, 42, 35],
//           },
//           {
//             title: "Math",
//             count: "(n=225)",
//             values: [82, 83, 66, 70, 69, 49, 32, 38, 53, 28],
//           },
//           {
//             title: "Computer Science",
//             count: "(n=451)",
//             values: [84, 72, 68, 72, 75, 51, 24, 32, 32, 51],
//           },
//         ],
//       },
//     },
//     workEnvironmentPreferences: {
//       metrics: {
//         environmentAlignment: {
//           overallScore: 75, // Average of all environment factors
//           hybridFlexibleWorkArrangements: 92,
//           collaborativeTeamSettings: 78,
//           autonomousDecisionAuthority: 75,
//           dynamicAdaptiveCulture: 70,
//           structuredProcessFramework: 58,
//         },
//       },
//       whyThisMatters:
//         "Research indicates that environment alignment significantly impacts job satisfaction and tenure. Your preference for autonomy within collaborative frameworks suggests environments where you can lead initiatives while maintaining strong team connections",
//       bestFitOrganizations:
//         "Mid-sized organizations or innovative departments within larger enterprises that blend collaboration with flexibility",
//     },
//     careerPathwayRecommendations: {
//       recommendations: [
//         {
//           title: "Organizational Development Consultant",
//           match: 85,
//           whyThisFitsYou:
//             "Leverages your Social-Enterprising strengths through facilitating organizational change and team effectiveness",
//           keyRequirements: [
//             "Experience in organizational change",
//             "Certification in OD methodologies",
//             "Strong facilitation skills",
//           ],
//           marketOutlook:
//             "12% projected growth (2024-2028), with particularly strong demand in healthcare, tech, and financial services sectors undergoing digital transformation. Remote consulting opportunities expanding with hybrid workplace models",
//           compensationRange:
//             "$85K-$130K for mid-level roles; senior consultants and directors typically earn $130K-$180K+ depending on organization size and industry",
//           careerProgressionPath:
//             "Entry as OD Consultant → Senior Consultant (3-4 years) → Director of Organizational Effectiveness (5-7 years) → Chief People Officer or VP of Organizational Development (8-10 years)",
//           potentialChallenges:
//             "Project-based work can create inconsistent workloads; may require significant travel; success depends on measurable organizational impact",
//           nextSteps:
//             "Pursue Certified Organizational Development Professional (CODP) credential",
//         },
//         {
//           title: "Learning & Development Manager",
//           match: 75,
//           whyThisFitsYou:
//             "Aligns with your Social orientation and interest in helping others develop their skills and capabilities",
//           keyRequirements: [
//             "Experience in training design and delivery",
//             "Knowledge of adult learning principles",
//             "Project management skills",
//           ],
//           marketOutlook:
//             "10% projected growth (2024-2028), with increasing demand for digital learning specialists and those who can develop hybrid training models",
//           compensationRange:
//             "$75K-$115K for mid-level roles; senior L&D managers typically earn $115K-$160K+ depending on organization size",
//           careerProgressionPath:
//             "L&D Specialist → L&D Manager (2-3 years) → Senior L&D Manager (4-6 years) → Director of Learning (7-9 years)",
//           potentialChallenges:
//             "Often requires demonstrating ROI for learning initiatives; may face budget constraints; needs to balance organizational priorities with individual development needs",
//           nextSteps:
//             "Obtain ATD Certified Professional in Learning & Performance (CPLP) credential",
//         },
//         {
//           title: "HR Business Partner",
//           match: 70,
//           whyThisFitsYou:
//             "Combines your people-focused orientation with strategic business alignment capabilities",
//           keyRequirements: [
//             "HR generalist knowledge",
//             "Business acumen",
//             "Consulting and relationship management skills",
//           ],
//           marketOutlook:
//             "8% projected growth (2024-2028), with increasing emphasis on strategic HR roles that can drive organizational transformation",
//           compensationRange:
//             "$70K-$110K for mid-level roles; senior HRBPs typically earn $110K-$150K+ depending on organization size and industry",
//           careerProgressionPath:
//             "HR Generalist → HRBP (2-3 years) → Senior HRBP (4-6 years) → HR Director (7-9 years)",
//           potentialChallenges:
//             "Requires balancing employee advocacy with business needs; may involve difficult conversations and change management; needs to establish credibility with business leaders",
//           nextSteps:
//             "Pursue SHRM-CP or PHR certification to establish HR credentials",
//         },
//       ],
//       theoreticalAlignment:
//         "These recommendations align with Holland's adjacency theory and Schein's Career Anchors research, indicating highest satisfaction when career choices match your inherent preferences and values",
//     },
//     developmentRoadmap: {
//       phases: [
//         {
//           title: "Foundation Building",
//           duration: "Months 0-3",
//           focusAreas: [
//             "Complete Learning Experience Design certification",
//             "Develop professional portfolio showcasing strategic implementation",
//             "Establish initial professional network (minimum 5 key connections)",
//             "Complete project management skills assessment",
//           ],
//           expectedOutcomes: [
//             "Technical knowledge baseline established, professional identity positioned for target market",
//           ],
//         },
//         {
//           title: "Professional Positioning",
//           duration: "Months 3-6",
//           focusAreas: [
//             "Implement demonstration project showing technical and strategic integration",
//             "Engage in professional community through targeted events",
//             "Develop thought leadership content in specialty area",
//             "Conduct outreach to decision-makers in preferred organizations",
//           ],
//           expectedOutcomes: [
//             "Application capability demonstrated, professional visibility enhanced",
//           ],
//         },
//         {
//           title: "Transition Implementation",
//           duration: "Months 6-9",
//           focusAreas: [
//             "Finalize credentials in target specialty",
//             "Establish consistent professional presence through content contribution",
//             "Develop strategic relationship network",
//             "Implement comprehensive job search strategy",
//           ],
//           expectedOutcomes: [
//             "Formal qualifications completed, recognition as emerging domain specialist",
//           ],
//         },
//       ],
//       personalAspirationsAlignment:
//         "This roadmap supports your expressed desires to develop expertise in organizational effectiveness methodologies, build toward a leadership position with influence on organizational culture, and create developmental opportunities for others. Your timeline aligns well with Super's career development theory regarding establishment and advancement stages.",
//     },
//     addressingKeyChallenges: {
//       challenges: [
//         {
//           title: "Technical Knowledge Gap",
//           solutions: [
//             "Complete LinkedIn Learning Data Literacy course (2 weeks)",
//             "Join SHRM or ATD for specialized resources",
//             "Identify mentor with technical background (3-month relationship)",
//           ],
//         },
//         {
//           title: "Industry Transition",
//           solutions: [
//             "Conduct 3-5 informational interviews with industry professionals (30 days)",
//             "Create industry-relevant case studies from existing experience (60 days)",
//             "Participate in industry-specific events (1/month minimum)",
//           ],
//         },
//       ],
//     },
//     growthOpportunities: {
//       opportunities: [
//         {
//           text: "Register for Learning Experience Design certification",
//           timeframe: "Next 2 weeks",
//         },
//         {
//           text: "Develop professional online presence highlighting SEC strengths",
//           timeframe: "Next 30 days",
//         },
//         {
//           text: "Schedule 3 informational interviews with professionals in target field",
//           timeframe: "Next 60 days",
//         },
//       ],
//     },
//     methodologyReferences: {
//       description:
//         "This assessment integrated a 12-question pre-assessment, AI-guided consultation, and analysis based on established career development frameworks including Holland's RIASEC model, Schein's Career Anchors, and Super's Life-Span theory",
//       references: [
//         "Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3rd ed.).",
//         "Schein, E. H. (1996). Career anchors revisited: Implications for career development in the 21st century.",
//         "Super, D. E. (1980). A life-span, life-space approach to career development.",
//       ],
//     },
//   },
// };

function CareerReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const careerCounsellingId = searchParams.get("id");
  const [careerId, setCareerId] = useState<string | null>(careerCounsellingId);

  const [careerReport, setCareerReport] = useState<ICareerReport>();
  const [isLoading, setIsLoading] = useState(false);

  const onCopyToClipboard = useCallback(async () => {
    const href = location.href;
    await navigator.clipboard.writeText(href);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/analytics/${careerId}`,
          {},
          { method: "GET" }
        );
        setCareerReport(response);
      } catch (error) {
        console.error("Failed to fetch interview analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (careerId) {
      fetchAnalytics();
    }
  }, [careerId]);

  if (isLoading) return <Loading />;

  if (!careerId) return <div>Career ID is required</div>;

  if (!careerReport) return <></>;

  return (
    <div className="flex h-full p-6">
      <div className="mx-auto max-w-7xl overflow-auto custom-scrollbar">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Comprehensive Career Report
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" />
                <span>{careerReport.userName}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2  text-blue-500" />
                <span>{careerReport.status}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2  text-blue-500" />
                <span>{careerReport.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2  text-blue-500" />
                <span>{careerReport.time}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => onCopyToClipboard()}
              variant="outline"
              className="flex p-2 items-center"
            >
              <Share2 className="h-5 w-6" />
            </Button>
            <Button
              onClick={() => console.log("hello")}
              variant="outline"
              className="flex px-3 py-2 gap-2 items-center"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex px-3 py-2 gap-2 items-center"
            >
              <Home className="h-4 w-4" />
              Go to the Dashboard
            </Button>
          </div>
        </div>
        <div className="text-secondary-foreground mb-6">
          This assessment integrated a 12-question pre-assessment, AI-guided
          consultation, and analysis based on established career development
          frameworks including Holland&apos;s RIASEC model, Schein&apos;s Career
          Anchors, and Super&apos;s Life-Span theory
        </div>
        {/* Main content */}
        <div className="space-y-6">
          <ExecutiveSummary data={careerReport.analytics.executiveSummary} />
          <CareerProfile data={careerReport.analytics.careerProfile} />
          <CareerValuesMotivators
            data={careerReport.analytics.careerValuesMotivators}
          />
          <SkillsAssessment data={careerReport.analytics.skillsAssessment} />
          <WorkEnvironmentPreferences
            data={careerReport.analytics.workEnvironmentPreferences}
          />
          <CareerPathwayRecommendations
            data={careerReport.analytics.careerPathwayRecommendations}
          />
          <DevelopmentRoadmap
            data={careerReport.analytics.developmentRoadmap}
          />
          <AddressingKeyChallenges
            challenges={
              careerReport.analytics.addressingKeyChallenges.challenges
            }
          />
          <GrowthOpportunities
            opportunities={
              careerReport.analytics.growthOpportunities.opportunities
            }
          />
          <MethodologyReferences
            description={
              careerReport.analytics.methodologyReferences.description
            }
            references={careerReport.analytics.methodologyReferences.references}
          />
          <div className="text-secondary-foreground mb-6">
            This report represents a professional interpretation of assessment
            data and should be considered a developmental resource rather than a
            definitive evaluation. <br /> This assessment is made available to
            you by ReCV.ai <br /> support@recv.ai
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareerReport() {
  return (
    <Suspense fallback={<Loading />}>
      <CareerReportContent />
    </Suspense>
  );
}
