type Ok<T> = {
  isOk: true;
  isErr: false;
  value: T;
};

const ok: <T>(v: T) => Ok<T> = (v) => {
  return {
    isOk: true,
    isErr: false,
    value: v,
  };
};

type Err = {
  isOk: false;
  isErr: true;
  err: Error;
};

const err: (err: Error) => Err = (err) => {
  return {
    isOk: false,
    isErr: true,
    err,
  };
};

type Result<T> = Ok<T> | Err;

type ThirdPartyApp = {
  getAccessRole(authService: AuthService, user: User): Result<string>;
};

const ThirdPartyApp: ThirdPartyApp = {
  getAccessRole(authService: AuthService, user: User): Result<string> {
    const result = authService.generateToken(user);
    if (result.isErr) {
      return err(result.err);
    }
    return ok(result.value);
  },
};

type HttpService = {
  isPermitted: (token: string, resource: string, action: string) => boolean;
};

type AuthService = {
  generateToken(user: User): Result<string>;
  authenticateUser(user: User): Result<null>;
};

const AuthService: AuthService = {
  generateToken(user: User): Result<string> {
    const result = this.authenticateUser(user);
    if (result.isErr) {
      return err(result.err);
    }

    return user.isPermitted() ? ok("token") : err(new Error("not permitted"));
  },
  authenticateUser(user: User): Result<null> {
    return ok(null);
  },
};

type User = {
  isPermitted(): boolean;
};

const User = {
  isPermitted(): boolean {
    return true;
  },
};

() => {
  ThirdPartyApp;
};
