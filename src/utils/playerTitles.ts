export const getPlayerTitle = (level: number): string => {
  switch (level) {
    case 1:
      return "Exit Liquidity";
    case 2:
      return "Jeeter";
    case 3:
      return "Trencher";
    case 4:
      return "Casual Caller";
    case 5:
      return "Alpha Caller";
    case 6:
      return "Tier 3 KOL";
    case 7:
      return "Tier 2 KOL";
    case 8:
      return "Elite KOL";
    case 9:
      return "Exchange CEO";
    default:
      return level > 9 ? "Exchange CEO" : "Exit Liquidity";
  }
}; 