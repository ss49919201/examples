import { DeepPartial } from "ts-essentials";

const newId = () => Math.floor(Math.random() * 1000);

type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  publisedAt: Date | null;

  userId: number;
};

type User = {
  id: number;
  name: string;
  email: string | null;

  posts: Post[];
};

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "a@example.com",
    posts: [
      {
        id: 1,
        title: "Hello, World!",
        body: "This is my first post.",
        tags: ["hello", "world"],
        publisedAt: null,
        userId: 1,
      },
    ],
  },
];

const updateUser = (input: {
  id: number;
  name?: string;
  email?: string | null;

  posts?: {
    id?: number;
    title?: string;
    body?: string;
    tags?: string[];
    publisedAt?: Date | null;
  }[];
}) => {
  const user = users.find(({ id }) => id === input.id);
  if (!user) {
    return;
  }

  if (input.name) {
    user.name = input.name;
  }

  if (input.email) {
    user.email = input.email;
  }

  if (input.posts) {
    for (const post of input.posts) {
      const userPost = user.posts.find(({ id }) => id === post.id);
      if (!userPost) {
        user.posts.push({
          id: newId(),
          title: post.title || "",
          body: post.body || "",
          tags: post.tags || [],
          publisedAt:
            typeof post.publisedAt === "undefined" ? null : post.publisedAt,
          userId: user.id,
        });
        continue;
      }

      if (post.body) {
        userPost.body = post.body;
      }

      if (post.tags) {
        userPost.tags = post.tags;
      }

      if (post.publisedAt) {
        userPost.publisedAt = post.publisedAt;
      }
    }
  }
};

const updateUserFromPartialUser = (input: DeepPartial<User>, user: User) => {
  Object.entries(input).forEach(([key, value]) => {
    // TODO: Implement this
  });
};
