import { toast } from "sonner";
import { Option, TargetRole, Interviewer, Language } from "./types";
import {
  LeafIcon,
  StarIcon,
  CrownIcon,
  NiAward,
  NiCheckHand,
  NiComment,
  NiLaptopFill,
  NiRanking,
  NiScaleStars,
  GraduationHat,
  BriefCase,
  Repeat,
  OpenBook,
  Rocket,
  XCircle,
  Contrast,
  Clock,
  BriefCase2,
  LayersThree,
  BuildingThree,
  AwardFour,
  CertificateOne,
  LightBulbFive,
  BankNote,
  Users01,
  UserCheck01,
  Home03,
  LightBulb02,
  CoinsHand,
  CpuChip,
  HeartHand,
  ClosedBook,
  Building07,
  Bank,
  Camera02,
  ShoppingBag,
  Target04,
  FileSearch,
  LayersThree01,
  Compass,
  Refresh,
  SearchRefraction,
  Tool02,
  BarChart07,
  Target03,
  Palette,
  BarChartSquare01,
  Eye,
  MessageChatSquare,
  Zap,
  PauseCircle,
  Building05,
  Rocket01,
  Laptop02,
  ClipboardCheck,
  User01,
  Home02,
  Globe06,
  OpenBook02,
  Map01,
  Link04,
  TrendUp01,
  Calendar,
  Compass03,
  CreditCard,
  Telescope,
  WatchCircle,
  MarkerPin,
  GlobeSlated,
  BeakerTwo,
  MagicWand,
  GraduationHatOne,
  FlagFive,
  DataIcon,
  ScalesTwo,
  StarSeven,
  Plane,
  Umbrella,
  MessageSmileSquare,
  PuzzlePiece,
  DotPoints,
  ImageUser,
  PresentationChart,
  ImageThree,
  Trophy,
  AnnotationQuestion,
  FileSix,
  OcGrowing,
  OcOnLaptop,
  NcNoAnswer,
  StructureChart,
  FreeStyleSkate,
} from "@/components/Icons/Icons";
import { Group, Interview, Invite, BillingPlan } from "@/payload-types";
import { rest } from "@/lib/rest";

export const socialButtons = [
  {
    src: "/Icons/Gmail.svg",
    alt: "Google login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/oauth/google/authorize`,
  },
  {
    src: "/Icons/Facebook.svg",
    alt: "Facebook login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/facebook`,
  },
  {
    src: "/Icons/LinkedIn.svg",
    alt: "LinkedIn login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/linkedin`,
  },
  {
    src: "/Icons/U.svg",
    alt: "U login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/google`,
  },
  {
    src: "/Icons/SB.svg",
    alt: "SB login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/facebook`,
  },
  {
    src: "/Icons/ID.svg",
    alt: "ID login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/linkedin`,
  },
  {
    src: "/Icons/Outlook.svg",
    alt: "Outlook login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/facebook`,
  },
  {
    src: "/Icons/Apple.svg",
    alt: "Apple login",
    href: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/oauth/signin/linkedin`,
  },
];

export const getIndustryOptions = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/industries?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getLevelOptions = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/levels?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getRoleOptions = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/roles?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getGoalOptions = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/goals?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getInterviewChallenges = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/challenges?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getCompanyTypes = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/companyTypes?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getInstitutionTypes = async (): Promise<Option[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/institutionTypes?limit=0`
  );
  const data = await res.json();
  return data.docs as Option[];
};

export const getRoleSelect = async (): Promise<TargetRole[]> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/targetRoles?limit=0`,
    {},
    {
      method: "GET",
    }
  );
  return res.docs as TargetRole[];
};

export const getInterviews = async ({
  limit,
  page,
  where,
}: {
  limit: number;
  page: number;
  where?: string;
}): Promise<{ interviews: any; totalPages: number }> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews?limit=${limit}&page=${page}&where=${where}`,
    {},
    {
      method: "GET",
    }
  );

  return {
    interviews: res.docs,
    totalPages: Math.ceil(res.totalPages),
  };
};

export const getConsultations = async ({
  limit,
  page,
  where,
}: {
  limit: number;
  page: number;
  where?: string;
}): Promise<{ consultations: any; totalPages: number }> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews?limit=${limit}&page=${page}&where=${where}`,
    {},
    {
      method: "GET",
    }
  );

  return {
    consultations: res.docs,
    totalPages: Math.ceil(res.totalPages),
  };
};

export const getInterviewer = async ({
  language,
}: {
  language: string;
}): Promise<Interviewer[]> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviewers/filtered-interviewers?language=${language}`,
    {},
    {
      method: "GET",
    }
  );

  const transformedDocs: Interviewer[] = res.map((doc: any) => ({
    id: doc.id,
    name: doc.name,
    title: doc.title,
    skillSet: doc.skills,
    photo: doc.picture.url,
  }));

  return transformedDocs;
};

export const getActiveParticipants = async ({
  limit,
  page,
  sort,
  sortOrder,
}: {
  limit: number;
  page: number;
  sort: string;
  sortOrder: string;
}): Promise<{ participants: any; totalPages: number }> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/active-participants?limit=${limit}&page=${page}&sort=${sort}&order=${sortOrder}`,
    {},
    {
      method: "GET",
    }
  );

  return {
    participants: res.result,
    totalPages: Math.ceil(res.totalPages / limit),
  };
};

export const getInvitedParticipants = async ({
  limit,
  page,
  sort,
  sortOrder,
}: {
  limit: number;
  page: number;
  sort: string;
  sortOrder: string;
}): Promise<{ participants: any; totalPages: number }> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invites/invited-participants?limit=${limit}&page=${page}&sort=${sort}&order=${sortOrder}`,
    {},
    {
      method: "GET",
    }
  );

  return {
    participants: res.result,
    totalPages: Math.ceil(res.totalPages / limit),
  };
};

export const getGroupOptions = async (): Promise<Group[]> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/group`,
    {},
    {
      method: "GET",
    }
  );

  return res.docs as Group[];
};

export const getLanguageOptions = async (): Promise<Language[]> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/languages`,
    {},
    {
      method: "GET",
    }
  );

  return res.docs.reverse() as Language[];
};

export const getBillingPlans = async (): Promise<BillingPlan[]> => {
  const res = await rest(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/billingPlans`,
    {},
    {
      method: "GET",
    }
  );

  return res.docs as BillingPlan[];
};

export const onboardingCareerSelect = [
  {
    where: "onboarding",
    picture: OcGrowing,
    title: "Student",
    value: "student",
    description: "Currently still learning",
    defaultStyle: "text-black",
    selectedStyle: "bg-primary text-primary-foreground",
    hoverStyle: "hover:bg-primary hover:text-primary-foreground",
  },
  {
    where: "onboarding",
    picture: OcOnLaptop,
    title: "Working Professional",
    value: "professional",
    description: "Have a job but looking for opportunities",
    defaultStyle: "text-black",
    selectedStyle: "bg-primary text-primary-foreground",
    hoverStyle: "hover:bg-primary hover:text-primary-foreground",
  },
  {
    where: "onboarding",
    picture: NcNoAnswer,
    title: "Currently Not Working",
    value: "free",
    description: "Looking to dive into the workforce",
    defaultStyle: "text-black",
    selectedStyle: "bg-primary text-primary-foreground",
    hoverStyle: "hover:bg-primary hover:text-primary-foreground",
  },
];

export const profileCareerSelect = [
  {
    where: "profile",
    picture: OcGrowing,
    title: "Aiming for College",
    value: "student",
    description: "Preparing for college interviews or applications",
    defaultStyle: "text-black outline outline-1",
    hoverStyle: "hover:outline-primary",
  },
  {
    where: "profile",
    picture: OcOnLaptop,
    title: "Working Professional",
    value: "professional",
    description: "Have a job but looking for opportunities",
    defaultStyle: "text-black outline outline-1",
    hoverStyle: "hover:outline-primary",
  },
  {
    where: "profile",
    picture: NcNoAnswer,
    title: "Currently Not Working",
    value: "free",
    description: "Looking for my dream job",
    defaultStyle: "text-black outline outline-1",
    hoverStyle: "hover:outline-primary",
  },
];

export const onboardingTrainingOptions = [
  {
    where: "onboarding",
    picture: StructureChart,
    title: "Structured Program",
    value: "structured",
    description:
      "Get a daily practice schedule with a personalized plan and calendar.",
    defaultStyle: "bg-accent text-black",
    hoverStyle: "hover:bg-primary hover:text-primary-foreground",
  },
  {
    where: "onboarding",
    picture: FreeStyleSkate,
    title: "Freestyle Practice",
    value: "freestyle",
    description: "Practice interviews anytime you want, whenever it suits you.",
    defaultStyle: "bg-accent text-black",
    hoverStyle: "hover:bg-primary hover:text-primary-foreground",
  },
];

export const profileTrainingOptions = [
  {
    where: "profile",
    picture: StructureChart,
    title: "Structured Program",
    value: "structured",
    description:
      "Get a daily practice schedule with a personalized plan and calendar.",
    defaultStyle: "text-black outline outline-1",
    hoverStyle: "hover:outline-primary",
  },
  {
    where: "profile",
    picture: FreeStyleSkate,
    title: "Freestyle Practice",
    value: "freestyle",
    description: "Practice interviews anytime you want, whenever it suits you.",
    defaultStyle: "text-black outline outline-1",
    hoverStyle: "hover:outline-primary",
  },
];

export const levelSelect = [
  {
    title: "Newcomer",
    description:
      "Fresh on the scene and struggling? Let's help you find your footing with the basics!",
    icon: LeafIcon,
    backgroundImage: "bg-[url('/interview-setup/leaf.svg')]",
  },
  {
    title: "Rising Star",
    description:
      "You're almost there—let's perfect your approach and ace those tricky questions!",
    icon: StarIcon,
    backgroundImage: "bg-[url('/interview-setup/stars.svg')]",
  },
  {
    title: "Pro Performer",
    description:
      "You're at the top! Now, it's time to own the room and secure that dream job!",
    icon: CrownIcon,
    backgroundImage: "bg-[url('/interview-setup/medal.svg')]",
  },
];

export const questionSelect = [
  {
    title: "Standard",
    description:
      "A balanced mix of technical, behavioral, and situational questions to assess overall competence",
    icon: ({ colorful }: { colorful: boolean }) => NiRanking({ colorful }),
  },
  {
    title: "Behavioral",
    description:
      "Reflect on past experiences to showcase decision-making, teamwork, and leadership abilities.",
    icon: ({ colorful }: { colorful: boolean }) => NiComment({ colorful }),
  },
  {
    title: "Leadership",
    description:
      "Focuses on leadership, problem-solving, and situational questions to assess handling challenges.",
    icon: ({ colorful }: { colorful: boolean }) => NiAward({ colorful }),
  },
  {
    title: "Situational",
    description:
      "Demonstrate your analytical thinking with real-world problem-solving and data interpretation.",
    icon: ({ colorful }: { colorful: boolean }) => NiCheckHand({ colorful }),
  },
  {
    title: "Technical Focus",
    description:
      "Prioritizes technical and role-specific questions to test your expertise & skills  in your field.",
    icon: ({ colorful }: { colorful: boolean }) => NiScaleStars({ colorful }),
  },
  {
    title: "Salary Negotiation",
    description:
      "Master discussing salary, benefits, and perks with confidence and professionalism.",
    icon: ({ colorful }: { colorful: boolean }) => NiLaptopFill({ colorful }),
  },
];

export const careerjourneyselect = [
  {
    title: "Exploring Education & Career Interests",
    description:
      "Little to no work experience, unsure, (high school student / recent graduate)",
    icon: Telescope,
  },
  {
    title: "Preparing for Career Entry",
    description:
      "Currently in college/university, experience through internships or part-time work",
    icon: GraduationHat,
  },
  {
    title: "New Professional",
    description:
      "0-2 years full-time experience, establishing career foundation, still refining direction",
    icon: Rocket,
  },
  {
    title: "Early Career Professional",
    description:
      "2-5 years experience, developing expertise, clarifying long-term career goal",
    icon: BriefCase,
  },
  {
    title: "Mid-Career Professional",
    description:
      "5-10 years experience, seeking advancement, specialization, or considering a pivot",
    icon: WatchCircle,
  },
  {
    title: "Experienced Professional",
    description:
      "10+ years experience, well-established,  exploring leadership or new career directions",
    icon: MarkerPin,
  },
];

export const workexperienceselect = [
  {
    title: "No work experience",
    description: "",
    icon: XCircle,
  },
  {
    title: "Internships / Part-time only",
    description: "",
    icon: Contrast,
  },
  {
    title: "1-2 years full-time",
    description: "",
    icon: Clock,
  },
  {
    title: "3+ years full-time",
    description: "",
    icon: BriefCase2,
  },
  {
    title: "Multiple industries experience",
    description: "",
    icon: LayersThree,
  },
];

export const educationselect = [
  {
    title: "High School",
    description: "",
    icon: BuildingThree,
  },
  {
    title: "Some Collge/University",
    description: "",
    icon: OpenBook,
  },
  {
    title: "Bachelor's Degree",
    description: "",
    icon: GraduationHat,
  },
  {
    title: "Master's Degree",
    description: "",
    icon: AwardFour,
  },
  {
    title: "Professional Certifications",
    description: "",
    icon: CertificateOne,
  },
  {
    title: "PhD/Doctorate",
    description: "",
    icon: GlobeSlated,
  },
  {
    title: "Self-taught / Alternative Education",
    description: "",
    icon: LightBulbFive,
  },
];

export const engagingselect = [
  {
    title: "Solving technical problems",
    description:
      " Building, hands-on repairing, using tools, working with machines",
    icon: Tool02,
  },
  {
    title: "Researching and analyzing information",
    description: " Investigating, conducting experiments, problem-solving",
    icon: BeakerTwo,
  },
  {
    title: "Creating original or innovative content",
    description: "Writing, designing, performing, generating new ideas",
    icon: MagicWand,
  },
  {
    title: "Teaching or helping others develop",
    description: "Mentoring, coaching, counseling, guiding, training people",
    icon: GraduationHatOne,
  },
  {
    title: "Leading projects/influencing",
    description:
      "Persuading, managing, running a business, delegating, negotiating",
    icon: FlagFive,
  },
  {
    title: "Organizing data or improving systems",
    description: "Structuring, planning, financial work, administrative tasks",
    icon: DataIcon,
  },
];

export const longtermgoalsselect = [
  {
    title: "Lifelong Learning & Intellectual Growth",
    description: "",
    icon: ClosedBook,
  },
  {
    title: "Work-Life Balance & Personal Wellbeing",
    description: "",
    icon: ImageThree,
  },
  {
    title: "Income Potential & Financial Rewards",
    description: "",
    icon: BankNote,
  },
  {
    title: "Making a Positive Impact on Society or Others",
    description: "",
    icon: HeartHand,
  },
  {
    title: "Travel & Exploration",
    description: "Career Achievement & Industry Recognition",
    icon: Trophy,
  },
];

export const solveproblemselect = [
  {
    title: "Logical & Systematic",
    description:
      "I analyze problems in a structured, step-by-step manner, breaking them into small parts.",
    icon: BarChartSquare01,
  },
  {
    title: "Pattern-Oriented & Insightful",
    description:
      "I recognize hidden patterns, trends, or underlying connections that others miss",
    icon: Eye,
  },
  {
    title: "Collaborative & Perspective-Seeking",
    description:
      "I gather diverse viewpoints and integrate perspectives before making decisions.",
    icon: MessageChatSquare,
  },
  {
    title: "Experimental Problem Solver",
    description:
      "I test approaches through hands-on experimentation, learning by trial and error.",
    icon: Zap,
  },
  {
    title: "Root-Cause Seeker",
    description:
      "I search beneath the surface to uncover fundamental causes of problems.",
    icon: SearchRefraction,
  },
];

export const currentworkselect = [
  {
    title: "Technology & Digital",
    description: "",
    icon: CpuChip,
  },
  {
    title: "Healthcare & Sciences",
    description: "",
    icon: HeartHand,
  },
  {
    title: "Education & Training",
    description: "",
    icon: ClosedBook,
  },
  {
    title: "Government & Non-profit",
    description: "",
    icon: Building07,
  },
  {
    title: "Business & Finance",
    description: "",
    icon: Bank,
  },
  {
    title: "Creative & Media",
    description: "",
    icon: Camera02,
  },
  {
    title: "Trade & Services",
    description: "",
    icon: ShoppingBag,
  },
  {
    title: "No formal experience",
    description: "",
    icon: XCircle,
  },
];

export const futurecareerselect = [
  {
    title: "Clear goal with a specific role in mind",
    description: "",
    icon: Target04,
  },
  {
    title: "Interested in a particular industry but unsure of roles",
    description: "",
    icon: FileSearch,
  },
  {
    title: "Exploring multiple career options",
    description: "",
    icon: LayersThree01,
  },
  {
    title: "Need help discovering options",
    description: "",
    icon: Compass,
  },
  {
    title: "Seeking a complete career change",
    description: "",
    icon: Refresh,
  },
];

export const workstyleselect = [
  {
    title: "Working with tools, technology, or hands-on tasks",
    description: "",
    icon: Tool02,
  },
  {
    title: "Investigating ideas, solving problems, and analyzing data",
    description: "",
    icon: SearchRefraction,
  },
  {
    title: "Expressing creativity through art, music, or writing",
    description: "",
    icon: Palette,
  },
  {
    title: "Helping, guiding, or educating others",
    description: "",
    icon: AnnotationQuestion,
  },
  {
    title: "Leading teams, making deals, and taking initiative",
    description: "",
    icon: Target03,
  },
  {
    title: "Organizing, structuring, or working with detailed information",
    description: "",
    icon: FileSix,
  },
];

export const influencechoiceselect = [
  {
    title: "Financial success & Stability",
    description: "(Steady income, benefits, long-term stability)",
    icon: BankNote,
  },
  {
    title: "Learning & Skill Mastery",
    description: "(Developing expertise, continual growth)",
    icon: GraduationHat,
  },
  {
    title: "Leadership & Influence",
    description: "(Managing teams, decision-making, coaching)",
    icon: Users01,
  },
  {
    title: "Independence & Autonomy",
    description:
      "(Self-directed work, freelancing, control over time and tasks",
    icon: UserCheck01,
  },
  {
    title: "Work-Life Balance/Flexibility",
    description: "(work schedule control, remote work, minimal stress)",
    icon: Home03,
  },
  {
    title: "Innovation & Creativity",
    description: "(Problem-solving, generating new ideas, original projects)",
    icon: LightBulb02,
  },
  {
    title: "Positive Social Impact",
    description: "(Helping others, contributing meaningfully to society)",
    icon: CoinsHand,
  },
];

export const makedecision = [
  {
    title: "Systematic analysis & research",
    description: "(Comparing all data, weighing risks, making logical choices)",
    icon: BarChartSquare01,
  },
  {
    title: "Experience-based intuition",
    description: "(Trusting gut feeling, acting on past success)",
    icon: Eye,
  },
  {
    title: "Collaborative discussion",
    description:
      "(Seeking input, brainstorming with others, team decision-making)",
    icon: MessageChatSquare,
  },
  {
    title: "Quick action & adjustment",
    description: "(Making fast, adaptable choices, handling uncertainty well)",
    icon: Zap,
  },
  {
    title: "Careful contemplation",
    description:
      "(Taking time to reflect, ensuring alignment with values & goals)",
    icon: PauseCircle,
  },
];

export const worksettingselect = [
  {
    title: "Traditional corporate structure",
    description: "(Hierarchical, structured roles, large teams)",
    icon: Building05,
  },
  {
    title: "Dynamic startup environment",
    description: "(Fast-paced, flexible, high innovation)",
    icon: Rocket01,
  },
  {
    title: "Independent remote work",
    description: "(Self-managed, digital nomad, solo projects)",
    icon: Laptop02,
  },
  {
    title: "Project-based teams",
    description: "(Collaborative, cross-functional, varied assignments)",
    icon: ClipboardCheck,
  },
  {
    title: "Client-facing roles",
    description: "(Consulting, sales, customer interaction)",
    icon: User01,
  },
  {
    title: "Flexible hybrid arrangement",
    description: "(Some remote, some in-office, best of both worlds)",
    icon: Home02,
  },
  {
    title: "Mixed-team collaboration",
    description: "(Cross-department, international or multidisciplinary teams)",
    icon: Globe06,
  },
];

export const importantdecisionsselect = [
  {
    title: "Strategic Planner",
    description:
      "I research thoroughly and plan ahead, ensuring calculated decisions",
    icon: FileSearch,
  },
  {
    title: "Security-Seeker",
    description:
      "I prioritize stability and predictable paths, avoiding major uncertainty",
    icon: Bank,
  },
  {
    title: "Proactive Explorer",
    description:
      "I actively pursue new challenges, embracing change and opportunities",
    icon: Rocket,
  },
  {
    title: "Deliberate Evaluator",
    description:
      "I carefully weigh opportunities as they arise, taking time to assess each option",
    icon: ClipboardCheck,
  },
  {
    title: "Adaptive Opportunist",
    description:
      "I stay open to change, responding positively when opportunities arise",
    icon: Map01,
  },
];

export const challengeselect = [
  {
    title: "Skill gap or qualification needs",
    description: "",
    icon: OpenBook02,
  },
  {
    title: "Industry/role transition difficulty",
    description: "",
    icon: BriefCase2,
  },
  {
    title: "Geographic limitations",
    description: "",
    icon: Map01,
  },
  {
    title: "Lacking connections to people/network",
    description: "",
    icon: Users01,
  },
  {
    title: "Market competition in my field",
    description: "",
    icon: TrendUp01,
  },
  {
    title: "Work history gaps or unrelated experience",
    description: "",
    icon: Calendar,
  },
  {
    title: "Career direction uncertainty",
    description: "",
    icon: Compass03,
  },
  {
    title: "Financial transition constraints",
    description: "",
    icon: CreditCard,
  },
  {
    title: "Time constraints - balancing job search",
    description: "",
    icon: Clock,
  },
];

export const hopeselect = [
  {
    title: "Expert Status & Influence",
    description: "Becoming a recognized authority in a specialized field.",
    icon: AwardFour,
  },
  {
    title: "Leadership & Strategic Impact",
    description:
      "Advancing into leadership roles and driving strategic decisions.",
    icon: Target04,
  },
  {
    title: "Financial Growth & Success",
    description: "Achieving financial stability and career-driven wealth.",
    icon: CoinsHand,
  },
  {
    title: "Entrepreneurial Creativity",
    description:
      "Building businesses, launching products, or pioneering ideas.",
    icon: Rocket01,
  },
  {
    title: "Work-Life Balance",
    description: "Structuring a career that supports personal well-being.",
    icon: ScalesTwo,
  },
  {
    title: "Social Impact & Meaning",
    description: "Contributing to society and making a lasting difference.",
    icon: StarSeven,
  },
  {
    title: "Cross Cultural Global Career",
    description: "Expanding internationally and working across cultures.",
    icon: Plane,
  },
  {
    title: "Freelance/Self-Employment",
    description:
      "Crafting a career on your own terms without rigid structures.",
    icon: Umbrella,
  },
];

export const approachselect = [
  {
    title:
      "I actively seek critical feedback and use it to continuously improve",
    description: "",
    icon: MessageSmileSquare,
  },
  {
    title:
      "I value detailed feedback but need time to process before implementing changes",
    description: "",
    icon: PuzzlePiece,
  },
  {
    title:
      "I prefer constructive suggestions that come with specific action steps",
    description: "",
    icon: DotPoints,
  },
  {
    title: "I focus primarily on feedback that aligns with my self-assessment ",
    description: "",
    icon: ImageUser,
  },
  {
    title: "I rely more on my own evaluation than external feedback",
    description: "",
    icon: PresentationChart,
  },
];

export const hourOptions = Array.from(
  { length: 24 },
  (_, i) => i.toString() + "h"
);

export const minuteOptions = Array.from(
  { length: 60 },
  (_, i) => i.toString() + "m"
);

export const weekOptions = ["day", "week", "month"];

export const dayOptions = Array.from({ length: 31 }, (_, i) =>
  (i + 1).toString()
);

export const monthOptions = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString()
);

export const PlansOverview = [
  {
    name: "Starter (Free Trial)",
    upfront: "$0",
    installments: "-",
    includedMinutes: "60 minutes / 5 fixed questions repeated each session",
    careerConsultation: "Not included",
    notes: "Includes a basic interview report",
  },
  {
    name: "Explorer",
    upfront: "$28",
    installments: "-",
    includedMinutes: "60 minutes Unlimited questions",
    careerConsultation: "Not included",
    notes: "Full interview performance analysis",
  },
  {
    name: "Achiever",
    upfront: "$49",
    installments: "$20 × 3 months",
    includedMinutes: "100 minutes Unlimited questions",
    careerConsultation: "Two AI Career Path Consultations",
    notes:
      "Full interview performance analysis + Up to 10 AI minutes per career consultation x 2",
  },
  {
    name: "Pro",
    upfront: "$72",
    installments: "$33 × 3 months",
    includedMinutes: "150 minutes Unlimited questions",
    careerConsultation: "Three AI Career Path Consultations",
    notes:
      "Full interview performance analysis + Up to 10 AI minutes per consultation x 3",
  },
  {
    name: "Career Pathfinder",
    upfront: "$35",
    installments: "-",
    includedMinutes: "Not included",
    careerConsultation: "Two extended AI Career Path Consultations",
    notes: "Up to 15 AI minutes per consultation x 3",
  },
];

export const ImportantNotes = [
  {
    plan: "Explorer",
    features: [
      "Career consultation minutes are added only if the user upgrades (+$26). Otherwise, no consultations included.",
      "Plan validity is 30 days.",
      "Starts with 60 min for interviews.",
      "If they purchase career consultation upgrade (+$26), they get +30 min dedicated for consultations.",
      "No consultations allowed without upgrade.",
    ],
  },
  {
    plan: "Achiever",
    features: [
      "Achiever: One career consultation can be added (+15 min) via upgrade (+$15). Any additional consultations consume from the regular 120 minutes.",
      "Plan validity is 60 days.",
      "Starts with 120 min for interviews.",
      "If they purchase the career consultation upgrade (+$15), they get +15 min extra for their first career consultation.",
      "After the first consultation, any additional career consultations consume from their regular 120 min balance (no added minutes)",
    ],
  },
  {
    plan: "Pro",
    features: [
      "Pro: All career consultations are already included. Each session uses minutes from the 180 min balance.",
      "Plan validity is 90 days.",
      "Starts with 180 min.",
      "Career consultations are already included, and every consultation simply uses up minutes from their total.",
      "No upgrades needed",
    ],
  },
  {
    plan: "Career Pathfinder",
    features: [
      "Career Pathfinder Standalone: $35 for 2 consultations.",
      "Valid for 12 months from date of purchase. (No interview practice minutes included.)",
      "Only 2 consultations included (no interviewing minutes)",
    ],
  },
];

// export const languages: Language[] = [
//   { id: "he", key: "il", name: "Hebrew" },
//   { id: "en", key: "gb", name: "English" },
//   { id: "bg", key: "bg", name: "Bulgarian" },
//   { id: "zh", key: "cn", name: "Chinese" },
//   { id: "cs", key: "cz", name: "Czech" },
//   { id: "da", key: "dk", name: "Danish" },
//   { id: "nl", key: "nl", name: "Dutch" },
//   { id: "fi", key: "fi", name: "Finnish" },
//   { id: "fr", key: "fr", name: "French" },
//   { id: "de", key: "de", name: "German" },
//   { id: "el", key: "gr", name: "Greek" },
//   { id: "hi", key: "in", name: "Hindi" },
//   { id: "hu", key: "hu", name: "Hungarian" },
//   { id: "id", key: "id", name: "Indonesian" },
//   { id: "it", key: "it", name: "Italian" },
//   { id: "ja", key: "jp", name: "Japanese" },
//   { id: "ko", key: "kr", name: "Korean" },
//   { id: "ms", key: "ms", name: "Malay" },
//   { id: "no", key: "no", name: "Norwegian" },
//   { id: "pl", key: "pl", name: "Polish" },
//   { id: "pt", key: "pt", name: "Portuguese" },
//   { id: "ro", key: "ro", name: "Romanian" },
//   { id: "ru", key: "ru", name: "Russian" },
//   { id: "sk", key: "sk", name: "Slovak" },
//   { id: "es", key: "es", name: "Spanish" },
//   { id: "sv", key: "sv", name: "Swedish" },
//   { id: "tr", key: "tr", name: "Turkish" },
//   { id: "uk", key: "ua", name: "Ukrainian" },
//   { id: "vi", key: "vn", name: "Vietnamese" },
// ];

export const FAQSections = [
  {
    id: 1,
    title: "Usage and Time Validity",
    items: [
      {
        title: "Minute Usage",
        description:
          "All interview and consultation minutes are valid for 12 months from the date of purchase. Any unused minutes will expire after this period.",
      },
      {
        title: "Time Deduction",
        description:
          "Dedicated Interview Practice time (60, 100, or 150 minutes) is separate from Career Path Consultation minutes and is only used for AI interview simulations.",
      },
    ],
  },
  {
    id: 2,
    title: "Career Consultation Rules",
    items: [
      {
        title: "Consultation Count Limit",
        description:
          "Your career consultation benefit is defined by the number of sessions offered (2 for Achiever, 3 for Pro). Completing these sessions fulfills the consultation service for your tier, regardless of any remaining consultation minutes.",
      },
      {
        title: "Session Definition",
        description:
          "A consultation session is considered initiated and used if the user accesses the service and uses at least two (2) minutes of the allotted time.",
      },
      {
        title: "Minute Forfeiture",
        description:
          "Once the fixed number of sessions for your tier is completed, the service benefit is fulfilled. Any unused minutes remaining in the dedicated consultation pool are considered void and will be removed.",
      },
    ],
  },
  {
    id: 3,
    title: "Nature of Service",
    items: [
      {
        title: "AI Guidance",
        description:
          "All insights, diagnostics, and reports provided are generated by our proprietary AI models. They are intended for educational and developmental purposes only and do not constitute legal or professional career advice.",
      },
      {
        title: "Guarantees",
        description:
          "We do not guarantee employment, university acceptance, or specific career outcomes. Success depends on the user's preparation and external factors.",
      },
    ],
  },
  {
    id: 4,
    title: "General Terms",
    items: [
      {
        title: "Refund Policy",
        description:
          "All sales are final. We do not offer refunds once minutes or consultations have been used, unless required by local consumer protection laws. Please see our full Terms of Service for complete details.",
      },
      {
        title: "Installment Plans",
        description:
          "Full minute and history access will be revoked if subsequent payments on an installment plan fail.",
      },
    ],
  },
];
