// Update PlayerStats interface in types.ts to include twitterUsername
export interface PlayerStats {
  sol: number;
  day: number;
  tradingSkill: number;
  xp: number;
  health: number;
  equipment: {
    computer: number;
    internet: number;
    desk: number;
    chair: number;
  };
  dailyProfits: number[];
  tradingMood?: 'fomo' | 'insider' | 'fader' | 'grass';
  gamblingMode: boolean;
  canGamble: boolean;
  followers: {
    count: number;
    multiplier: number;
    lastGrowth: number;
  };
  referrals: {
    count: number;
    lastGrowth: number;
  };
  hasTwitter: boolean;
  twitterUsername?: string;
  canCreateMemecoins: boolean;
  memecoinLaunchesToday: number;
  activeMemecoin?: {
    name: string;
    trend: string;
    liquidity: number;
    isRugPull: boolean;
    launchTime: number;
    price: number;
    holders: number;
    ath: number;
    currentPhase: 'launch' | 'pump' | 'distribution' | 'decline';
  };
  trendscope: boolean;
  bundler: boolean;
  twitterGiveaway: boolean;
  referralFarming: boolean;
  referralEarnings: number;
  dayStartSol: number;
  hasCreatedMemecoinToday?: boolean;
}

export interface ActiveTrade {
  coin: string;
  size: number;
  timestamp: number;
  pnl: number;
  currentPrice: number;
  entryPrice: number;
  ath?: number;
}

export interface ActiveMemecoin {
  name: string;
  trend: string;
  liquidity: number;
  isRugPull: boolean;
  launchTime: number;
  price: number;
  holders: number;
  ath: number;
  currentPhase: 'launch' | 'pump' | 'distribution' | 'decline';
}