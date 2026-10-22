
const STORAGE_KEY = "azota_admin_users";

const initialUsers = [
  {
    id: "U001",
    code: "SV001",
    fullName: "Nguyễn Văn An",
    email: "an@example.com",
    role: "STUDENT",
    status: "ACTIVE",
  },
  {
    id: "U002",
    code: "GV001",
    fullName: "Trần Thị Bình",
    email: "binh@example.com",
    role: "TEACHER",
    status: "LOCKED",
  },
  {
    id: "U003",
    code: "AD001",
    fullName: "Lê Minh Khoa",
    email: "khoa@example.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
];

function readUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialUsers)
      );
      return [...initialUsers];
    }

    const users = JSON.parse(stored);
    return Array.isArray(users) ? users : [...initialUsers];
  } catch {
    return [...initialUsers];
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function getUsers() {
  return readUsers();
}

export async function createUser(payload) {
  const users = readUsers();

  const newUser = {
    ...payload,
    id: crypto.randomUUID(),
    status: payload.status || "ACTIVE",
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
}

export async function updateUser(id, payload) {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new Error("Không tìm thấy người dùng");
  }

  users[index] = {
    ...users[index],
    ...payload,
    id,
  };

  writeUsers(users);
  return users[index];
}

export async function toggleUserLock(id) {
  const users = readUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }

  user.status =
    user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

  writeUsers(users);
  return user;
}
