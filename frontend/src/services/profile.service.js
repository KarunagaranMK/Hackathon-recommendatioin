import api from "./api";

export const profileService = {
  getProfile: () => api.get("/profile"),
  saveProfile: (data) => api.post("/profile", data),
  updateProfile: (data) => api.put("/profile", data),
};
