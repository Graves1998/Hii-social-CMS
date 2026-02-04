import { useQuery } from '@tanstack/react-query';
import { systemService } from '../services/system-service';

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => systemService.getPermissions(),
  });
};
