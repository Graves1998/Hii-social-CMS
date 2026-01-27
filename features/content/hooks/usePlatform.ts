import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platform-service';
import { queryKeys } from '../query-keys';

const usePlatforms = () => {
  const platformsQuery = useQuery({
    queryKey: queryKeys.platforms.lists(),
    queryFn: platformService.getPlatforms,
  });
  return platformsQuery;
};

export { usePlatforms };
