import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { contentService } from '../services/content-service';
import { Reel } from '../types';
import { transformReelContent } from '../utils';

interface ScheduleContentPayload {
  reel_id: string;
  scheduled_at: string;
}

/**
 * Hook để schedule content publish
 */
export const useScheduleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reel_id,
      scheduled_at,
    }: ScheduleContentPayload & { approving_status: string }) =>
      contentService.scheduleContent({ reel_id, scheduled_at }),
    onMutate: async (variables) => {
      const detailQueryKey = queryClient.getQueryCache().find({
        queryKey: queryKeys.content.details(variables.reel_id, variables.approving_status),
      })?.queryKey;

      if (!detailQueryKey) return null;

      await queryClient.cancelQueries({ queryKey: detailQueryKey });
      const previousData = queryClient.getQueryData(detailQueryKey);

      queryClient.setQueriesData({ queryKey: detailQueryKey }, (old: Reel | undefined) => {
        if (!old) return old;
        const updated = { ...old, is_pending: true };
        return transformReelContent(updated);
      });

      return { queryKey: detailQueryKey, previousData };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_id, variables.approving_status],
      });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
  });
};
