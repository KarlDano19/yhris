import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/applicant-favorites/';

// Fetch all favorite applicants for the employer
export function useGetApplicantFavorites(search?: string) {
  return useQuery({
    queryKey: ['applicant-favorites', search],
    queryFn: async () => {
      const params = search ? { search } : {};
      const { data } = await axios.get(API_URL, { params });
      return data?.data || [];
    },
  });
}

// Add an applicant to favorites
export function useAddApplicantFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicantId: number) => {
      const { data } = await axios.post(API_URL, { applicant: applicantId });
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-favorites'] });
    },
  });
}

// Remove an applicant from favorites
export function useRemoveApplicantFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicantId: number) => {
      // Backend expects applicant ID in the body
      const { data } = await axios.delete(API_URL, { data: { applicant: applicantId } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-favorites'] });
    },
  });
} 