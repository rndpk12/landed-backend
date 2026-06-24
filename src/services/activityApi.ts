import { apiClient } from '../lib/apiClient';
import type { Activity } from '../types/activity';

interface BackendActivityResponse {
  id: string;
  type: Activity['type'];
  title: string;
  description: string;
  entityId?: string | null;
  occurredAt: string;
}

const mapActivity = (activity: BackendActivityResponse): Activity => ({
  id: activity.id,
  type: activity.type,
  title: activity.title,
  description: activity.description,
  entityId: activity.entityId ?? null,
  occurredAt: activity.occurredAt
});

export const activityApi = {
  async list(): Promise<Activity[]> {
    const response = await apiClient.get<BackendActivityResponse[]>('/activities');
    return response.data
      .map(mapActivity)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }
};
