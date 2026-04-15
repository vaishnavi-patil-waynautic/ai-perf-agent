export const calculateProductivity = (stats: any) => {
  const MANUAL_SCRIPT_TIME_HOURS = 4; // Average time to manual JMX creation
  const AI_SCRIPT_TIME_HOURS = 0.2;   // 12 minutes
  const ENGINEER_HOURLY_RATE = 80;    // Industry average

  const scriptsGenerated = stats.totalScripts || 0;
  const hoursSaved = scriptsGenerated * (MANUAL_SCRIPT_TIME_HOURS - AI_SCRIPT_TIME_HOURS);
  const costSavings = hoursSaved * ENGINEER_HOURLY_RATE;

  return {
    hoursSaved: Math.round(hoursSaved),
    costSavings: costSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    productivityBoost: `${((MANUAL_SCRIPT_TIME_HOURS / AI_SCRIPT_TIME_HOURS) * 100).toFixed(0)}%`
  };
};