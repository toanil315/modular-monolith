import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UserRepresentation } from './user-representation.model';

interface KeyCloakTokenResponse {
  access_token: string;
  expires_in: number;
}

@Injectable()
export class KeycloakClient implements OnModuleInit {
  private accessToken?: string;
  private expiresAt?: number;
  private tokenUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.tokenUrl = this.configService.getOrThrow('AUTH_TOKEN_URL');
  }

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use(async (config) => {
      if (config.url?.includes(this.tokenUrl)) {
        return config;
      }

      const token = await this.getClientAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async registerUser(user: UserRepresentation) {
    const baseUrl = this.configService.getOrThrow('AUTH_ADMIN_URL');
    const usersEndpoint = `${baseUrl}/users`;

    const response = await firstValueFrom(
      this.httpService.request({
        url: usersEndpoint,
        data: user,
        method: 'POST',
      }),
    );

    return this.extractIdentityIdFromLocationHeader(response);
  }

  private extractIdentityIdFromLocationHeader(response: { headers: Record<string, any> }): string {
    const usersSegmentName = 'users/';

    const locationHeader = response.headers['location'] || response.headers['Location'];

    if (!locationHeader) {
      throw new Error('Location header is null');
    }

    const userSegmentValueIndex = locationHeader
      .toLowerCase()
      .indexOf(usersSegmentName.toLowerCase());

    if (userSegmentValueIndex === -1) {
      throw new Error(`'${usersSegmentName}' not found in Location header`);
    }

    const identityId = locationHeader.substring(userSegmentValueIndex + usersSegmentName.length);

    return identityId;
  }

  private async getClientAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < (this?.expiresAt ?? 0)) {
      return this.accessToken;
    }

    const clientId = this.configService.getOrThrow('CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('CLIENT_SECRET');

    const data = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'openid',
    });

    const response = await firstValueFrom(
      this.httpService.request<KeyCloakTokenResponse>({
        url: this.tokenUrl,
        data: data.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      }),
    );

    this.accessToken = response.data.access_token;
    this.expiresAt = Date.now() + response.data.expires_in * 1000 - 5000; // renew 5s early

    return this.accessToken;
  }
}
