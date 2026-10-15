const mockUsers = [
  {
    userId: "U001",
    identifier: "student01",
    password: "123456",
    fullName: "Nguyen Van A",
    role: "STUDENT",
    status: "ACTIVE",
  },
  {
    userId: "U002",
    identifier: "teacher01",
    password: "123456",
    fullName: "Tran Thi B",
    role: "TEACHER",
    status: "ACTIVE",
  },
  {
    userId: "U003",
    identifier: "admin01",
    password: "123456",
    fullName: "Le Van C",
    role: "ADMIN",
    status: "ACTIVE",
  },
];

export const loginApi = async (identifier, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find(
    (u) => u.identifier === identifier && u.password === password
  );

  if (!user) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng!");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Tài khoản đã bị khóa!");
  }

  const { password: _password, ...safeUser } = user;

  return safeUser;
};

export const logoutApi = async () => {
  return true;
};