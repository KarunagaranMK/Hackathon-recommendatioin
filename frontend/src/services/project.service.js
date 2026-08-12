import api from "./api";

export const projectService = {
  listProjects: (params) => api.get("/projects", { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const favoriteService = {
  toggleFavorite: (projectId) => api.post("/favorites", { project_id: projectId }),
  getFavorites: () => api.get("/favorites"),
  getFavoriteIds: () => api.get("/favorites/ids"),
};
