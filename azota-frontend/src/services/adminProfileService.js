
const KEY = "azota_admin_profile";

const initialProfile = {
  userId: "AD001",
  fullName: "Nguyễn Hoàng Nam",
  email: "admin@school.edu.vn",
  role: "ADMIN",
  status: "ACTIVE",
};

export function getAdminProfile() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return { ...initialProfile };

    const data = JSON.parse(saved);
    return { ...initialProfile, ...data };
  } catch {
    return { ...initialProfile };
  }
}

export function updateAdminProfile(payload) {
  const current = getAdminProfile();

  const updated = {
    ...current,
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
  };

  if (!updated.fullName || !updated.email) {
    throw new Error("Vui lòng nhập đầy đủ thông tin.");
  }

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
