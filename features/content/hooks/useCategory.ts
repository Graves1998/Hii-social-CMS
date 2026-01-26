import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category-service';
import { queryKeys } from '../query-keys';

const useCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: categoryService.getCategories,
  });
  return categoriesQuery;
};

export { useCategories };
