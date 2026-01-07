import { Integration } from "../types/settings.types";

export const integrationService = {
  list: async (): Promise<Integration[]> => {
    return Promise.resolve([
      { type: "github", name: "GitHub", connected: true, token: "ghp_xxx" },
      { type: "datadog", name: "Datadog", connected: false }
    ]);
  },
  connect: async (type: string, token: string) => Promise.resolve(),
  update: async (type: string, token: string) => Promise.resolve()
};
