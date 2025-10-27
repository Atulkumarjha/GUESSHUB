import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      balance?: number;
      _id?: string;
    };
  }

  interface User {
    balance?: number;
    _id?: string;
  }
}
