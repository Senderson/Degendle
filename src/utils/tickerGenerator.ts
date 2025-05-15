// Define consonants and vowels for generating random tickers
const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
const vowels = 'AEIOU';

// Function to generate a random ticker with 2 to 4 letters
export const generateRandomTicker = (): string => {
  const length = Math.floor(Math.random() * 3) + 2; // Random length between 2 and 4
  let ticker = '';

  for (let i = 0; i < length; i++) {
    const chars = i % 2 === 0 ? consonants : vowels;
    ticker += chars[Math.floor(Math.random() * chars.length)];
  }

  return ticker;
}; 