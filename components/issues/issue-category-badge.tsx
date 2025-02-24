import { IssueCategory } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getCategoryColor, getCategoryIcon } from '@/lib/utils/issue-helpers'

export const IssueCategoryBadge = ({
  category
}: {
  category: IssueCategory
}) => {
  const CategoryIcon = getCategoryIcon(category)
  return (
    <span
      className={cn(
        'p-1 px-2 rounded-full text-xs font-medium flex items-center gap-2 w-fit',
        getCategoryColor(category)
      )}
    >
      <CategoryIcon className="size-4" />
      <span>{category} Issue</span>
    </span>
  )
}
