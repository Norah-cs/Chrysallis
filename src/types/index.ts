export interface FormData {
  name: string;
  email: string;
  password: string,
  university: string;
  year: string;
  techInterest: string;
  introBlurb: string;
  practiceGoals: string[];
  butterflyTheme: string;
  socials: {
    linkedin: string;
    instagram: string;
    discord: string;
    twitter: string;
  };
  shareSocialsAfterSession: boolean;
}

export interface TechOption {
  value: string;
  label: string;
}

export interface PracticeGoal {
  id: string;
  label: string;
  emoji: string;
}

export interface YearOption {
  value: number;
  label: string;
}

export interface ButterflyTheme {
  name: string;
  colors: string[];
}