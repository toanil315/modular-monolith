export const USERS_PUBLIC_APIS_TOKEN = 'USERS_PUBLIC_APIS_TOKEN';

export interface UsersPublicApis {
  getUserById: (userId: string) => Promise<GetUserByIdResponse | null>;
}

export class GetUserByIdResponse {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
  ) {}
}
