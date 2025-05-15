import React, { useState, useEffect, useRef } from 'react';
import { DayNightCycle } from './components/DayNightCycle';
import { Stats } from './components/Stats';
import { DayRecap } from './components/DayRecap';
import { PnLAnimation } from './components/PnLAnimation';
import { MoodSelector } from './components/MoodSelector';
import { GameConsole } from './components/GameConsole';
import { SocialPanel } from './components/SocialPanel';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { GameOver } from './components/GameOver';
import { PlayerStats, ActiveTrade, MemecoinConfig } from './types';
import { MEME_PHRASES, WIN_MESSAGES, LOSS_MESSAGES, LEVEL_UP_MESSAGES } from './constants';
import { UpgradesWindow } from './components/UpgradesWindow';
import { ReferralStats } from './components/ReferralStats';
import { NightModal } from './components/NightModal';

const DAY_DURATION = 40000;
const PRICE_UPDATE_INTERVAL = 100;
const GAMBLING_NOTIFICATION_INTERVAL = 2000;

// Helper function to generate random number in range
function range(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Define outcome probabilities for significant moves
const TRADE_OUTCOMES = {
  RUG_PULL: { chance: 0.15, multiplier: -0.99 },
  HEAVY_DUMP: { chance: 0.10, multiplier: range(-0.8, -0.6) },
  DUMP: { chance: 0.15, multiplier: range(-0.6, -0.3) },
  SMALL_MOVE: { chance: 0.40, multiplier: range(-0.2, 0.3) },
  PUMP: { chance: 0.12, multiplier: range(0.5, 2) },
  MOON: { chance: 0.05, multiplier: range(3, 10) },
  SUPER_MOON: { chance: 0.01, multiplier: range(10, 50) }
};

const IDLE_PHRASES = [
  "Setting up my snipers...",
  "Doing Solscan investigation...",
  "Searching for insider's wallet...",
  "Brainstorming with ChatGPT...",
  "Trenching...",
  "Drawing triangles on charts...",
  "Asking CT for alpha...",
  "DMing influencers 'ser wen token'...",
  "Watching Richard Heart videos...",
  "Studying ancient Wojak patterns..."
];

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);

  // Day cycle state
  const [dayProgress, setDayProgress] = useState(0);
  const [dayStartTime, setDayStartTime] = useState<number | null>(null);
  const [showRecap, setShowRecap] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [pnlPopups, setPnlPopups] = useState<Array<{
    id: number;
    amount: number;
    x: number;
    y: number;
    type?: 'rug_pull';
  }>>([]);
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [rugPullTimeout, setRugPullTimeout] = useState<NodeJS.Timeout | null>(null);
  const [popupCounter, setPopupCounter] = useState(0);
  const [consoleEntries, setConsoleEntries] = useState<Array<{
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'meme';
    timestamp: number;
  }>>([]);

  const [stats, setStats] = useState<PlayerStats>({
    sol: 5,
    day: 1,
    tradingSkill: 1,
    xp: 0,
    health: 100,
    equipment: {
      computer: 1,
      internet: 1,
      desk: 1,
      chair: 1,
    },
    dailyProfits: [],
    gamblingMode: false,
    canGamble: false,
    followers: {
      count: 0,
      multiplier: 1,
      lastGrowth: 0
    },
    hasTwitter: false,
    dayStartSol: 5,
    trendscope: false,
    twitterGiveaway: false,
    bundler: false,
    canCreateMemecoins: false,
    referralFarming: false,
    referralEarnings: 0,
    memecoinLaunchesToday: 0
  });

  // Prevent duplicate mood selection logging (happens in StrictMode)
  const moodSelectedRef = useRef<boolean>(false);

  // Helper function to add console entries
  const addConsoleEntry = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' | 'meme' = 'info'
  ) => {
    setConsoleEntries(prev => [
      ...prev,
      {
        id: Date.now(),
        message,
        type,
        timestamp: Date.now()
      }
    ].slice(-50)); // Keep only last 50 entries
  };

  // Clean up rug pull timeout on unmount
  useEffect(() => {
    return () => {
      if (rugPullTimeout) {
        clearTimeout(rugPullTimeout);
      }
    };
  }, [rugPullTimeout]);

  // Clean up old popups
  useEffect(() => {
    const cleanup = setInterval(() => {
      setPnlPopups(popups => popups.filter(p => Date.now() - p.id < 1000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Update active memecoin if exists
  useEffect(() => {
    if (stats.activeMemecoin && !showRecap && !showMoodSelector) {
      const interval = setInterval(() => {
        setStats(prev => {
          if (!prev.activeMemecoin) return prev;

          const timeSinceLaunch = (Date.now() - prev.activeMemecoin.launchTime) / 1000;
          let priceMultiplier = 1;
          let holderChange = 0;

          if (prev.activeMemecoin.isRugPull && timeSinceLaunch > 300) {
            priceMultiplier = 0.01;
            holderChange = -Math.floor(prev.activeMemecoin.holders * 0.9);
          } else {
            const trendMultiplier = {
              trump: 1.5,
              dog: 1.2,
              cat: 1.3,
              elon: 1.8
            }[prev.activeMemecoin.trend] || 1;

            const baseChange = (Math.random() - 0.45) * 0.1 * trendMultiplier;
            priceMultiplier = 1 + baseChange;
            holderChange = Math.floor(
              prev.activeMemecoin.holders * 
              (baseChange > 0 ? 0.1 : -0.05) * 
              Math.random()
            );
          }

          return {
            ...prev,
            activeMemecoin: {
              ...prev.activeMemecoin,
              price: prev.activeMemecoin.price * priceMultiplier,
              holders: Math.max(0, prev.activeMemecoin.holders + holderChange)
            }
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [stats.activeMemecoin, showRecap, showMoodSelector]);

  // Gambling mode notifications
  useEffect(() => {
    if (stats.gamblingMode && !showRecap && !showMoodSelector) {
      const interval = setInterval(() => {
        setPopupCounter(prev => prev + 1);
        
        // Calculate gambling outcome based on mood
        let amount = 0;
        const random = Math.random();
        
        // Update SOL balance with gambling results
        if (stats.tradingMood === 'fomo') {
          if (random < 0.8) {
            amount = -(Math.random() * 2 + 1);
            addConsoleEntry(`Lost ${(-amount).toFixed(2)} SOL gambling! NGMI...`, 'error');
          } else {
            amount = Math.random() * 0.5;
            addConsoleEntry(`Won ${amount.toFixed(2)} SOL gambling! Lucky!`, 'success');
          }
        } else if (stats.tradingMood === 'insider') {
          if (random < 0.7) {
            amount = Math.random() * 3 + 1;
            addConsoleEntry(`Won ${amount.toFixed(2)} SOL gambling! Inside edge pays off! 🎯`, 'success');
          } else {
            amount = -(Math.random() * 0.5);
            addConsoleEntry(`Lost ${(-amount).toFixed(2)} SOL gambling. Even insiders lose sometimes! 🎲`, 'error');
          }
        } else {
          amount = (Math.random() - 0.5) * 1;
          if (amount > 0) {
            addConsoleEntry(`Won ${amount.toFixed(2)} SOL gambling! 🎲`, 'success');
          } else {
            addConsoleEntry(`Lost ${(-amount).toFixed(2)} SOL gambling! 💸`, 'error');
          }
        }
        
        // Update the SOL balance immediately
        setStats(prev => ({
          ...prev,
          sol: Math.max(0, prev.sol + amount) // Prevent negative balance
        }));
        
        // Create a PnL popup
        setPnlPopups(prev => [...prev, {
          id: Date.now() * 1000 + popupCounter,
          amount,
          x: Math.random() * (window.innerWidth - 200) + 100,
          y: Math.random() * (window.innerHeight - 200) + 100,
        }]);
        
        // Award a small XP bonus for leaving Auto Gambling Mode ON
        setStats(prev => {
          const xpIncrement = 1;
          let newXP = prev.xp + xpIncrement;
          let newLevel = prev.tradingSkill;
          let threshold = newLevel * 100;
          while (newXP >= threshold) {
            newXP -= threshold;
            newLevel++;
            threshold = newLevel * 100;
          }
          return { 
            ...prev, 
            xp: newXP, 
            tradingSkill: newLevel,
            health: Math.max(0, prev.health - 1) // Reduce health over time while gambling
          };
        });

        // Check for game over if SOL or health reaches 0
        if (stats.sol <= 0 || stats.health <= 0) {
          setGameOver(true);
          setStats(prev => ({ ...prev, gamblingMode: false }));
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [stats.gamblingMode, showRecap, showMoodSelector, stats.tradingMood, popupCounter]);

  useEffect(() => {
    if (activeTrade && !showRecap) {
      const interval = setInterval(() => {
        const timeDiff = (Date.now() - activeTrade.timestamp) / 1000;
        let baseVolatility = 0.02 * Math.sqrt(stats.tradingSkill);
        let probabilityModifier = 1;
        let volatilityModifier = 1;
        
        switch (stats.tradingMood) {
          case 'insider':
            probabilityModifier = 1.3;
            volatilityModifier = 0.9;
            break;
          case 'fomo':
            probabilityModifier = 0.7;
            volatilityModifier = 1.8;
            break;
          case 'fader':
            probabilityModifier = 0.8;
            volatilityModifier = 1.5;
            break;
        }

        if (activeTrade.isRugPull && timeDiff > activeTrade.rugPullDelay) {
          const rugPullPrice = activeTrade.entryPrice * 0.01;
          const rugPullPnL = -activeTrade.size * 0.99;
          
          setPopupCounter(prev => prev + 1);
          setPnlPopups(prev => [...prev, {
            id: Date.now() * 1000 + popupCounter,
            amount: rugPullPnL,
            x: Math.random() * (window.innerWidth - 200) + 100,
            y: Math.random() * (window.innerHeight - 200) + 100,
            type: 'rug_pull'
          }]);
          
          setActiveTrade(prev => prev ? {
            ...prev,
            currentPrice: rugPullPrice,
            pnl: rugPullPnL
          } : null);
          
          setTimeout(() => handleCloseTrade(), 100);
          return;
        }

        let priceChange = 0;
        
        if (Math.random() < 0.05 * volatilityModifier) {
          const random = Math.random();
          let cumulativeProbability = 0;
          
          for (const [outcome, data] of Object.entries(TRADE_OUTCOMES)) {
            if (outcome === 'RUG_PULL') continue;
            cumulativeProbability += data.chance * probabilityModifier;
            
            if (random <= cumulativeProbability) {
              if (typeof data.multiplier === 'function') {
                priceChange = data.multiplier();
              } else {
                priceChange = data.multiplier;
              }
              break;
            }
          }
        } else {
          const trend = Math.sin(timeDiff * 0.05) * 0.005;
          const noise = (Math.random() - 0.5) * 0.01 * volatilityModifier;
          const momentum = Math.sin(timeDiff * 0.02) * 0.008;
          
          priceChange = (trend + noise + momentum) * baseVolatility;
        }

        const newPrice = Math.max(
          activeTrade.currentPrice * (1 + priceChange),
          activeTrade.entryPrice * 0.0001
        );

        const priceRatio = newPrice / activeTrade.entryPrice;
        const newPnL = activeTrade.size * (priceRatio - 1);

        const maxGain = activeTrade.size * 50;
        const maxLoss = -activeTrade.size * 0.99;
        const cappedPnL = Math.min(Math.max(newPnL, maxLoss), maxGain);

        const newPriceClamped = Math.min(newPrice, activeTrade.ath || Infinity);

        setActiveTrade(prev => prev ? {
          ...prev,
          currentPrice: newPriceClamped,
          pnl: cappedPnL
        } : null);
      }, PRICE_UPDATE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [activeTrade, showRecap, stats.tradingSkill, stats.tradingMood]);

  // Day progression
  useEffect(() => {
    if (!showRecap && !showMoodSelector) {
      if (!dayStartTime) {
        setDayStartTime(Date.now());
        return;
      }

      const interval = setInterval(() => {
        const elapsed = Date.now() - dayStartTime;
        const progress = Math.min(elapsed / DAY_DURATION, 1);
        setDayProgress(progress);

        setStats(prev => ({
          ...prev,
          health: Math.max(0, prev.health - (0.01 * (prev.equipment.chair === 1 ? 1 : 0.5)))
        }));

        if (progress >= 1) {
          clearInterval(interval);
          let additionalProfit = 0;
          
          // Close any open trade and add profits
          if (activeTrade) {
            additionalProfit += activeTrade.pnl;
            setActiveTrade(null);
          }

          // Calculate and add memecoin profits if exists
          if (stats.activeMemecoin) {
            const memecoinProfit = (stats.activeMemecoin.price - 1) * stats.activeMemecoin.liquidity;
            additionalProfit += memecoinProfit;

            // Create PnL popup for memecoin profits
            setPopupCounter(prev => prev + 1);
            setPnlPopups(prev => [...prev, {
              id: Date.now() * 1000 + popupCounter,
              amount: memecoinProfit,
              x: Math.random() * (window.innerWidth - 200) + 100,
              y: Math.random() * (window.innerHeight - 200) + 100,
            }]);
          }

          // Calculate follower growth
          // Calculate progressive follower growth based on the current day
          const minFollowers = 5 + (stats.day - 1) * 5;
          const maxFollowers = 20 + (stats.day - 1) * 5;
          const followerGrowth = Math.floor(Math.random() * (maxFollowers - minFollowers + 1)) + minFollowers;

          setStats(prev => {
            const baseSol = prev.dayStartSol;
            const newSol = prev.sol + additionalProfit;
            const dailyProfit = newSol - baseSol;

            if (newSol <= 0) {
              setGameOver(true);
              return prev;
            }
            
            return {
              ...prev,
              sol: newSol,
              dailyProfits: [...prev.dailyProfits, dailyProfit],
              followers: prev.hasTwitter ? {
                ...prev.followers,
                count: prev.followers.count + followerGrowth,
                lastGrowth: followerGrowth
              } : prev.followers,
              activeMemecoin: undefined // Reset active memecoin at end of day
            };
          });
          setShowRecap(true);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [dayStartTime, showRecap, showMoodSelector, stats.hasTwitter, stats.activeMemecoin, activeTrade]);

  // Add idle messages to console periodically
  useEffect(() => {
    if (!showRecap && !showMoodSelector && !gameOver) {
      const interval = setInterval(() => {
        const randomPhrase = IDLE_PHRASES[Math.floor(Math.random() * IDLE_PHRASES.length)];
        addConsoleEntry(randomPhrase, 'meme');
      }, 15000); // Show a random phrase every 15 seconds
      
      return () => clearInterval(interval);
    }
  }, [showRecap, showMoodSelector, gameOver]);

  // Add this effect for referral growth
  useEffect(() => {
    if (stats.referralFarming && !showRecap && !showMoodSelector) {
      const interval = setInterval(() => {
        setStats(prev => {
          // Calculate new referrals (slow growth)
          const baseGrowth = Math.random() * 2; // 0-2 referrals per tick
          const multiplier = prev.followers.multiplier;
          const newReferrals = Math.floor(baseGrowth * multiplier);
          
          // Calculate earnings based on referrals
          const dailyEarnings = ((prev.followers.count + newReferrals) * 0.1) * 0.01 * 17.28;
          const earningsPerTick = dailyEarnings / (DAY_DURATION / 5000); // Distribute earnings over the day
          
          return {
            ...prev,
            followers: {
              ...prev.followers,
              count: prev.followers.count + newReferrals
            },
            referralEarnings: prev.referralEarnings + earningsPerTick,
            sol: prev.sol + earningsPerTick
          };
        });
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [stats.referralFarming, showRecap, showMoodSelector]);

  const handleOpenTrade = (coin: string, size: number) => {
    addConsoleEntry(`Opening trade: ${coin} with ${size.toFixed(2)} SOL`, 'info');
    const entryPrice = Math.random() * 0.01;
    const isRugPull = Math.random() < 0.15;
    const rugPullDelay = isRugPull ? 5 + Math.random() * 10 : 0;
    
    let adjustedSize = size;
    if (stats.tradingMood === 'fomo') {
      adjustedSize *= 1.5;
    } else if (stats.tradingMood === 'fader') {
      adjustedSize *= 0.8;
    }
    
    setActiveTrade({
      coin,
      entryPrice,
      currentPrice: entryPrice,
      size: adjustedSize,
      timestamp: Date.now(),
      pnl: 0,
      isRugPull,
      rugPullDelay
    });
  };

  const handleCloseTrade = () => {
    if (activeTrade) {
      // Add trade result to console with funny message
      if (activeTrade.pnl > 0) {
        addConsoleEntry(getRandomMessage(WIN_MESSAGES), 'success');
        
        // Base 10 XP + 1 XP per SOL won
        const bonusXp = Math.floor(activeTrade.pnl);
        const totalXp = 10 + bonusXp;
        
        setStats(prev => ({
          ...prev,
          xp: prev.xp + totalXp,
          tradingSkill: prev.xp + totalXp >= prev.tradingSkill * 100 
            ? prev.tradingSkill + 1 
            : prev.tradingSkill,
          sol: prev.sol + activeTrade.pnl,
          dailyProfits: [...prev.dailyProfits, activeTrade.pnl]
        }));
      } else {
        addConsoleEntry(getRandomMessage(LOSS_MESSAGES), 'error');
        
        // Base 10 XP for completing a trade, even on losses
        setStats(prev => ({
          ...prev,
          xp: prev.xp + 10,
          tradingSkill: prev.xp + 10 >= prev.tradingSkill * 100 
            ? prev.tradingSkill + 1 
            : prev.tradingSkill,
          sol: prev.sol + activeTrade.pnl,
          dailyProfits: [...prev.dailyProfits, activeTrade.pnl]
        }));
      }

      // Create PnL popup
      setPnlPopups(prev => [...prev, {
        id: Date.now() * 1000 + popupCounter,
        amount: activeTrade.pnl,
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 200) + 100
      }]);

      setActiveTrade(null);
    }
  };

  const handleMoodSelect = (mood: 'fomo' | 'insider' | 'fader' | 'grass' | 'smart') => {
    // If we've already processed a mood selection, ignore subsequent calls
    if (moodSelectedRef.current) return;
    moodSelectedRef.current = true;

    // Add a random meme phrase and the mood selection message
    const memePhrase = MEME_PHRASES[Math.floor(Math.random() * MEME_PHRASES.length)];
    addConsoleEntry(memePhrase, 'meme');
    addConsoleEntry(`Mood selected: ${mood}`, 'info');

    // Update the stats with the selected mood and record the starting SOL for the day
    setStats(prev => ({ ...prev, tradingMood: mood, dayStartSol: prev.sol }));
    setShowMoodSelector(false);
    setDayStartTime(Date.now()); // Start the day when mood is selected
  };

  const [isNightModalOpen, setIsNightModalOpen] = useState(false);

  const handleSleep = () => {
    setIsNightModalOpen(true);
  };

  const handleWakeUp = () => {
    setIsNightModalOpen(false);
    // Reset the mood selection flag
    moodSelectedRef.current = false;

    // Update the day, health, mood, and reset the day starting balance.
    setStats(prev => {
      // Calculate referral earnings for the day
      const dailyReferralEarnings = prev.referralFarming ? 
        ((prev.followers.count * 0.1) * 0.01 * 17.28) : 0;

      return {
        ...prev,
        day: prev.day + 1,
        health: Math.min(100, prev.health + 30),
        tradingMood: undefined,
        hasCreatedMemecoinToday: false,
        dayStartSol: prev.sol,
        sol: prev.sol + dailyReferralEarnings,
        referralEarnings: (prev.referralEarnings || 0) + dailyReferralEarnings,
        followers: {
          ...prev.followers,
          lastGrowth: prev.followers.count
        },
        memecoinLaunchesToday: 0
      };
    });

    // Close the day recap modal
    setShowRecap(false);

    // Open the mood selector for the new day
    setShowMoodSelector(true);
  };

  const handleUpgrade = (upgrade: string, username?: string) => {
    switch (upgrade) {
      case 'show_upgrades':
        setShowUpgrades(true);
        break;
      case 'gambling':
        if (stats.sol >= 2 && !stats.canGamble && stats.tradingSkill >= 3) {
          setStats(prev => ({
            ...prev,
            sol: prev.sol - 2,
            canGamble: true
          }));
          addConsoleEntry('Auto Gambling Mode unlocked! Use with caution... 🎲', 'success');
          setShowUpgrades(false);
        }
        break;
      case 'equipment':
        // Get equipment level and corresponding cost
        const currentLevel = Math.floor(
          (stats.equipment.computer + 
           stats.equipment.internet + 
           stats.equipment.desk + 
           stats.equipment.chair) / 4
        );
        
        let upgradeCost;
        switch (currentLevel) {
          case 1:
            upgradeCost = 12;
            break;
          case 2:
            upgradeCost = 24;
            break;
          case 3:
            upgradeCost = 50;
            break;
          default:
            upgradeCost = 999999; // Prevent further upgrades
        }
        
        if (stats.sol >= upgradeCost) {
          setStats(prev => ({
            ...prev,
            sol: prev.sol - upgradeCost,
            equipment: {
              computer: prev.equipment.computer + 1,
              internet: prev.equipment.internet + 1,
              desk: prev.equipment.desk + 1,
              chair: prev.equipment.chair + 1,
            }
          }));
          addConsoleEntry(`Equipment upgraded! Cost: ${upgradeCost.toFixed(2)} SOL`, 'success');
          setShowUpgrades(false);
        } else {
          addConsoleEntry(`Not enough SOL for equipment upgrade. Need ${upgradeCost.toFixed(2)} SOL`, 'error');
        }
        break;
      case 'twitter':
        if (!stats.hasTwitter && username && username.trim()) {
          setStats(prev => ({
            ...prev,
            hasTwitter: true,
            twitterUsername: username.replace('@', ''),
            followers: {
              count: 0,
              multiplier: 1,
              lastGrowth: 0
            }
          }));
          addConsoleEntry('Twitter account created! Start building your social presence! 🐦', 'success');
          setShowUpgrades(false);
        }
        break;
      case 'trendscope':
        if (stats.sol >= 0.5 && !stats.trendscope && stats.canCreateMemecoins) {
          setStats(prev => ({
            ...prev,
            sol: prev.sol - 0.5,
            trendscope: true
          }));
          addConsoleEntry('Purchased Trendscope! Enhanced memecoin analysis unlocked.', 'success');
          setShowUpgrades(false);
        }
        break;
      case 'twitterGiveaway':
        if (stats.day >= 4 && stats.sol >= 1 && !stats.twitterGiveaway) {
          setStats(prev => ({
            ...prev,
            sol: prev.sol - 1,
            twitterGiveaway: true,
            followers: {
              ...prev.followers,
              count: prev.followers.count + 200
            }
          }));
        }
        break;
      case 'bundler':
        if (stats.day >= 4 && stats.sol >= 20 && !stats.bundler) {
          setStats(prev => ({
            ...prev,
            sol: prev.sol - 20,
            bundler: true
          }));
        }
        break;
      case 'referralFarming':
        if (stats.tradingSkill >= 3 && !stats.referralFarming) {
          setStats(prev => ({
            ...prev,
            referralFarming: true
          }));
        }
        break;
      case 'memecoinLearn':
        if (stats.sol >= 0.5 && !stats.canCreateMemecoins) {
          setStats(prev => ({
            ...prev,
            sol: prev.sol - 0.5,
            canCreateMemecoins: true,
          }));
          addConsoleEntry('Learned how to launch memecoins! You can now create your own tokens. 🚀', 'success');
          setShowUpgrades(false);
        }
        break;
      default:
        break;
    }
  };

  // Add a toggle function for gambling mode
  const toggleGamblingMode = () => {
    if (stats.canGamble) {
      setStats(prev => ({
        ...prev,
        gamblingMode: !prev.gamblingMode
      }));
      addConsoleEntry(`Auto Gambling Mode turned ${!stats.gamblingMode ? 'ON' : 'OFF'}`, 'info');
    }
  };

  const handleLaunchMemecoin = (config: MemecoinConfig) => {
    if (!stats.canCreateMemecoins) {
      addConsoleEntry('You need to learn memecoin creation first!', 'error');
      return;
    }

    // Calculate potential ATH based on Twitter followers
    const followerCount = stats.followers?.count ?? 0;
    const baseAthMultiplier = 10; // Base 10x potential
    const followerBonus = Math.min(40, Math.floor(followerCount / 1000)); // +1x per 1000 followers, max 40x bonus
    const athMultiplier = baseAthMultiplier + followerBonus;
    
    const initialPrice = 0.00000002;
    const ath = initialPrice * athMultiplier;

    setStats(prev => ({
      ...prev,
      sol: prev.sol - config.initialLiquidity,
      activeMemecoin: {
        name: config.name,
        trend: config.trend,
        liquidity: config.initialLiquidity,
        isRugPull: config.isRugPull,
        launchTime: Date.now(),
        price: initialPrice,
        holders: 1,
        ath: ath,
        currentPhase: 'launch'
      },
      memecoinLaunchesToday: prev.memecoinLaunchesToday + 1
    }));

    addConsoleEntry(`🚀 Launched ${config.name}!`, 'success');
    addConsoleEntry(`💎 Target ATH: ${ath.toFixed(8)} (${athMultiplier}x)`, 'info');
  };

  const handleRugMemecoin = () => {
    if (stats.activeMemecoin) {
      addConsoleEntry('RUGGED! Thanks for the liquidity ser! 🏃‍♂️', 'error');
      const rugPullProfit = stats.activeMemecoin.liquidity * 0.9; // Take 90% of liquidity
      // Log the PnL result to the console after a rugpull
      console.log(`Rugpull executed for memecoin ${stats.activeMemecoin.name}. PnL result: ${rugPullProfit.toFixed(2)} SOL`);
      
      // Create PnL popup for rug pull profits
      setPopupCounter(prev => prev + 1);
      setPnlPopups(prev => [...prev, {
        id: Date.now() * 1000 + popupCounter,
        amount: rugPullProfit,
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 200) + 100,
        type: 'rug_pull'
      }]);

      // Update stats and close memecoin
      setStats(prev => ({
        ...prev,
        sol: prev.sol + rugPullProfit,
        activeMemecoin: undefined, // Close memecoin immediately
        hasCreatedMemecoinToday: true // Mark that we've created a memecoin today
      }));
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setStats({
      sol: 5,
      day: 1,
      tradingSkill: 1,
      xp: 0,
      health: 100,
      equipment: {
        computer: 1,
        internet: 1,
        desk: 1,
        chair: 1,
      },
      dailyProfits: [],
      gamblingMode: false,
      canGamble: false,
      followers: {
        count: 0,
        multiplier: 1,
        lastGrowth: 0
      },
      hasTwitter: false,
      dayStartSol: 5,
      trendscope: false,
      twitterGiveaway: false,
      bundler: false,
      canCreateMemecoins: false,
      referralFarming: false,
      referralEarnings: 0,
      memecoinLaunchesToday: 0,
      activeMemecoin: undefined,
      hasCreatedMemecoinToday: false
    });
    setShowMoodSelector(true);
  };

  const handleMemecoinPriceChange = (newPrice: number) => {
    if (stats.activeMemecoin && stats.gamblingMode) {
      const priceDiff = newPrice - stats.activeMemecoin.price;
      const percentageChange = (newPrice - stats.activeMemecoin.price) / stats.activeMemecoin.price;
      const profitLoss = stats.activeMemecoin.liquidity * percentageChange;
      
      // Calculate new holders based on price change
      const calculateNewHolders = (currentHolders: number, currentPrice: number, newPrice: number) => {
        const priceRatio = newPrice / currentPrice;
        if (priceRatio > 1) {
          // Price went up - holders increase exponentially
          const increase = Math.floor(currentHolders * (priceRatio - 1) * 2);
          return currentHolders + Math.max(1, increase);
        } else {
          // Price went down - holders decrease more slowly
          const decrease = Math.floor(currentHolders * (1 - priceRatio) * 0.5);
          return Math.max(1, currentHolders - decrease);
        }
      };
      
      if (stats.activeMemecoin) {
        const newHolders = calculateNewHolders(
          stats.activeMemecoin.holders,
          stats.activeMemecoin.price,
          newPrice
        );
        
        setStats(prev => ({
          ...prev,
          sol: prev.sol + profitLoss,
          activeMemecoin: {
            ...prev.activeMemecoin,
            price: newPrice,
            holders: newHolders
          }
        }));
      }
    }
  };

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a16] text-white">
        <LandingPage onStart={handleStartGame} />
      </div>
    );
  }

  if (gameOver) {
    return (
      <GameOver
        score={stats.sol}
        stats={stats}
        onRestart={handleStartGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white">
      <>
        <Header day={stats.day} sol={stats.sol} />
        <div className="max-w-4xl mx-auto space-y-4 pt-20 p-4">
          <DayNightCycle 
            progress={dayProgress} 
            activeTrade={activeTrade}
            onOpenTrade={handleOpenTrade}
            onCloseTrade={handleCloseTrade}
            maxSize={stats.sol}
            canCreateMemecoins={stats.canCreateMemecoins}
            activeMemecoin={stats.activeMemecoin}
            onLaunchMemecoin={handleLaunchMemecoin}
            onRugMemecoin={handleRugMemecoin}
            hasCreatedMemecoinToday={stats.hasCreatedMemecoinToday}
            stats={stats}
            setStats={setStats}
          />
          {stats.referralFarming && <ReferralStats stats={stats} />}
          <SocialPanel stats={stats} />
          <GameConsole entries={consoleEntries} />
          <Stats 
            stats={stats} 
            onToggleGambling={toggleGamblingMode}
          />
          
          {showRecap && (
            <DayRecap 
              stats={stats}
              onSleep={handleSleep}
              onUpgrade={handleUpgrade}
            />
          )}
        </div>
        <PnLAnimation popups={pnlPopups} />
        
        {showMoodSelector && (
          <MoodSelector onSelect={handleMoodSelect} day={stats.day} />
        )}
        
        {showUpgrades && (
          <UpgradesWindow
            stats={stats}
            onClose={() => setShowUpgrades(false)}
            onUpgrade={handleUpgrade}
          />
        )}
      </>
      <button onClick={handleSleep} className="sleep-button">
        Sleep
      </button>

      {isNightModalOpen && <NightModal onClose={handleWakeUp} />}
    </div>
  );
}

export default App;