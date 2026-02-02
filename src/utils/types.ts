import { BillingPlan } from "@/payload-types";

export type GroupedPlans = {
  interviewPlan?: BillingPlan;
  consultationPlan?: BillingPlan;
};

export interface Option {
  id: string;
  label: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TargetRole {
  id: string;
  level: Option;
  role: Option;
  industry: Option;
  companyType: Option;
  jobDescription?: string;
  companyInfo?: string;
}

export interface Interviewer {
  id: string;
  name: string;
  title: string;
  skillSet: object;
  photo: string;
}

export interface Language {
  id: string;
  label: string;
  key: string;
  value: string;
}

export interface InterviewReport {
  interviewee: {
    name?: string;
    avatar?: string;
    goal?: string;
  };
  interview: {
    createdAt?: string;
    level?: string;
    focus?: string[];
  };
  analytics?: {
    summary?: {
      overallScore?: number | null;
      improvement?: number | null;
    };
    metrics?: {
      verbalCommunication?: {
        overallScore?: number | null;
        speechClarity?: number | null;
        speechFlow?: number | null;
        useOfLanguage?: number | null;
      };
      physicalPresence?: {
        overallScore?: number | null;
        eyeContact?: number | null;
        posture?: number | null;
        facialExpressions?: string | null;
      };
      emotionalCues?: {
        overallScore?: number | null;
        anxiety?: string | null;
        confidence?: number | null;
        energy?: string | null;
      };
    };
    keyStrengths?: string[] | null;
    growthOpportunities?: string[] | null;
    emotionalAnalysis?: {
      confident?: number | null;
      happy?: number | null;
      excited?: number | null;
      confused?: number | null;
      anxious?: number | null;
      shy?: number | null;
      focused?: number | null;
    };
    keyInsights?:
    | {
      title?: string | null;
      category?: ("Presence" | "Non-verbal" | "Verbal" | "Language") | null;
      description?: string | null;
      id?: string | null;
    }[]
    | null;
    detailedQuestions?:
    | {
      id?: string | null;
      question?: string | null;
      answer?: string | null;
      answerStart?: number | null;
      answerEnd?: number | null;
      questionMetrics?: {
        verbalCommunication?: {
          overallScore?: number | null;
          speeachClarity?: number | null;
          speechFlow?: number | null;
          useOfLanguage?: number | null;
        };
        physicalPresence?: {
          overallScore?: number | null;
          eyeContact?: number | null;
          posture?: number | null;
          facialExpressions?: string | null;
        };
        emotionalCues?: {
          overallScore?: number | null;
          anxiety?: string | null;
          confidence?: number | null;
          energy?: string | null;
        };
      };
      questionEmotionalAnalysis?: {
        confident?: number | null;
        happy?: number | null;
        excited?: number | null;
        confused?: number | null;
        anxious?: number | null;
        shy?: number | null;
        focused?: number | null;
      };
      questionKeyInsights?:
      | {
        title?: string | null;
        category?:
        | ("Presence" | "Non-verbal" | "Verbal" | "Language")
        | null;
        description?: string | null;
        id?: string | null;
      }[]
      | null;
      analyzedData?: {
        score?: number | null;
        questionType?: string | null;
        summary?: string | null;
        relevance?: string | null;
        structure?: string | null;
        language?: string | null;
        improvedAnswer?: string | null;
        potentialIncrease?: number | null;
        keyStrength?: string | null;
        growthOpportunity?: string | null;
      };
    }[]
    | null;
  };
}

export interface CareerReport {
  userName: string;
  status: string;
  date: string;
  time: string;
  analytics: {
    executiveSummary: {
      description: string;
      metrics: {
        careerPathwaysMatch: {
          overallScore: number;
          // Add specific metric values as direct properties
          organizationalDevelopmentConsultant?: number;
          learningDevelopmentManager?: number;
          hrBusinessPartner?: number;
          // Any other specific career metrics
        };
      };
      priorityDevelopmentAreas: string[];
      longTermTrajectory: string;
      estimatedTransitionTimeline: string;
      riasecProfile: {
        values: number[];
      };
    };
    careerProfile: {
      hollandCode: {
        code: string;
        social: number;
        enterprising: number;
        conventional: number;
      };
      meaning: string[];
      bestFitFields: string[];
      cognitiveApproach: string;
    };
    careerValuesMotivators: {
      description: string;
      metrics: {
        careerDecisionsAreDrivenBy: {
          overallScore: number;
          positiveImpactOnOthers?: number;
          workLifeBalance?: number;
          continuousLearning?: number;
          professionalRecognition?: number;
          financialRewards?: number;
        };
      };
      primaryMotivators: string[];
      practicalApplications: string[];
      idealOrganizationalCultures: string;
      emotionalAnalysis: {
        values: number[];
      };
    };
    skillsAssessment: {
      coreStrengths: Array<{
        skill: string;
        rating: number;
      }>;
      emergingStrengths: Array<{
        skill: string;
        rating: number;
      }>;
      developmentPriorities: Array<{
        skill: string;
        rating: number;
        priority: string;
        learningPeriod: string;
      }>;
      skillsMatrix: {
        columns: string[];
        rows: Array<{
          title: string;
          count: string;
          values: number[];
        }>;
      };
    };
    workEnvironmentPreferences: {
      metrics: {
        environmentAlignment: {
          overallScore: number;
          hybridFlexibleWorkArrangements?: number;
          collaborativeTeamSettings?: number;
          autonomousDecisionAuthority?: number;
          dynamicAdaptiveCulture?: number;
          structuredProcessFramework?: number;
        };
      };
      whyThisMatters: string;
      bestFitOrganizations: string;
    };
    careerPathwayRecommendations: {
      recommendations: Array<{
        title: string;
        match: number;
        whyThisFitsYou: string;
        keyRequirements: string[];
        marketOutlook: string;
        compensationRange: string;
        careerProgressionPath: string;
        potentialChallenges: string;
        nextSteps: string;
      }>;
      theoreticalAlignment: string;
    };
    developmentRoadmap: {
      phases: Array<{
        title: string;
        duration: string;
        focusAreas: string[];
        expectedOutcomes: string[];
      }>;
      personalAspirationsAlignment: string;
    };
    addressingKeyChallenges: {
      challenges: Array<{
        title: string;
        solutions: string[];
      }>;
    };
    growthOpportunities: {
      opportunities: Array<{
        text: string;
        timeframe: string;
      }>;
    };
    methodologyReferences: {
      description: string;
      references: string[];
    };
  };
}
