type SignupInput = {
  userId: string;
  password: string;

  getPepper: () => Promise<string>; // パスワード格納先とは別の領域に保存しておいて使用時に取得
  save: (input: { userId: string; password: string }) => Promise<void>;
  generateSalt: () => Promise<string>; // パスワードごとに生成
  hashPassword: (input: {
    password: string;
    salt: string;
    pepper: string;
  }) => string;
};

type Signup = (input: SignupInput) => Promise<void>;

const signup: Signup = async ({
  userId,
  password,
  getPepper,
  save,
  generateSalt,
  hashPassword,
}) => {
  const [pepper, salt] = await Promise.all([getPepper(), generateSalt()]);
  const hashedPassword = hashPassword({
    password,
    salt,
    pepper,
  });
  await save({ userId, password: hashedPassword });
};
