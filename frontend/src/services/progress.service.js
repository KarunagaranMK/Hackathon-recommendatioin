import api from "./api";

export const progressService = {
  getProgress: (projectId) => api.get(`/progress/${projectId}`),
  getAllProgress: () => api.get("/progress"),
  createProgress: (data) => api.post("/progress", data),
  updateStep: (projectId, stepIndex, completed) =>
    api.put(`/progress/${projectId}`, { project_id: projectId, step_index: stepIndex, completed }),
};
