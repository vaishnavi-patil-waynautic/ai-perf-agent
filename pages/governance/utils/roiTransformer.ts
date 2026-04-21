export const transformRoiOverview = (data: any) => {
  return {
    kpis: {
      'roi-kpi-1': {
        value: `${data.total_time_saved} hrs`,
        trend: 0,
      },
      'roi-kpi-2': {
        value: `${data.manual_effort_reduction}%`,
        trend: 0,
      },
      'roi-kpi-3': {
        value: `$${data.cost_savings}`,
        trend: 0,
      },
      'roi-kpi-4': {
        value: `${data.automation_coverage}%`,
        trend: 0,
      },
      'roi-kpi-5': {
        value: `${data.return_on_investment}%`,
        trend: 0,
      },
      'roi-kpi-6': {
        value: `${data.productivity_improvement}%`,
        trend: 0,
      },
    },

    charts: {
      'roi-line-1': data.time_savings_trend.map((d: any) => ({
        name: d.month,
        value: d.value,
      })),
      'roi-line-2': data.cost_savings_trend.map((d: any) => ({
        name: d.month,
        value: d.value,
      })),
    },

    // 🔥 THIS FIXES YOUR LLM KPIs
    llm: {
      totalTokens: data.total_llm_tokens,
      totalCost: data.total_llm_cost,

      byModel: Object.entries(data.token_usage_by_model || {}).map(
        ([key, val]: any) => ({
          id: key,
          label: key,
          tokens: val.tokens,
          cost: val.cost,
        })
      ),
    },
  };
};