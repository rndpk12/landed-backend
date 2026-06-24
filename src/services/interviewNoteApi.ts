import { apiClient } from '../lib/apiClient';
import type { InterviewNote, InterviewNotePayload } from '../types/interviewNote';

export const interviewNoteApi = {
  async list(applicationId: string): Promise<InterviewNote[]> {
    const response = await apiClient.get<InterviewNote[]>('/applications/' + applicationId + '/interview-notes');
    return response.data;
  },
  async create(applicationId: string, payload: InterviewNotePayload): Promise<InterviewNote> {
    const response = await apiClient.post<InterviewNote>('/applications/' + applicationId + '/interview-notes', payload);
    return response.data;
  },
  async update(id: string, payload: InterviewNotePayload): Promise<InterviewNote> {
    const response = await apiClient.put<InterviewNote>('/interview-notes/' + id, payload);
    return response.data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete('/interview-notes/' + id);
  }
};
