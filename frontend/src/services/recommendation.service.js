import api from "./api";

export const recommendationService = {
  getRecommendations: (topK = 10) => api.post("/recommend", { top_k: topK }),
  getHistory: () => api.get("/recommend/history"),
};
