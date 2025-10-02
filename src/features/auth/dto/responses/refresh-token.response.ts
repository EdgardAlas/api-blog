export class RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;

  constructor(data?: Partial<RefreshTokenResponse>) {
    Object.assign(this, data);
  }
}
