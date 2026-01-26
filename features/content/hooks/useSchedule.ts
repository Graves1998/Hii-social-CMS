import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../services/content-service';
import { queryKeys } from '../query-keys';

interface ScheduleContentPayload {
  contentId: string;
  scheduledTime: string;
}

/**
 * Hook để schedule content publish
 */
export const useScheduleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, scheduledTime }: ScheduleContentPayload) =>
      contentService.scheduleContent(contentId, scheduledTime),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.list() });
    },
  });
};
