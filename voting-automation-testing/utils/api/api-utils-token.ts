import { ApiClient } from './api-client';
import { getBaseUrl } from '../utils';

export async function issueCmsToken(): Promise<string> {
    const client = await ApiClient.init(getBaseUrl());
    const token = await client.get<string>('/cms/issue-token');
    await client.dispose();
    return token;
  }
