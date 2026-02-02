import { Card, CardContent, CardHeader, CardTitle } from '@/components/ContentCard/ContentCard';
import { LucideIcon } from 'lucide-react';

type IconConfig = LucideIcon | LucideIcon[];

interface IconListProps {
  headerIcon: LucideIcon;
  itemIcon: IconConfig;
  title: string;
  items: string[];
  color: string;
  className?: string;
}

export default function IconList({
  headerIcon: HeaderIcon,
  itemIcon: ItemIcon,
  title,
  items,
  color,
  className = '',
}: IconListProps) {
  const getItemIcon = (index: number) => {
    if (Array.isArray(ItemIcon)) {
      return ItemIcon[index % ItemIcon.length];
    }
    return ItemIcon;
  };

  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center gap-2'>
        <HeaderIcon className={`h-5 w-5 text-[${color}]`} />
        <CardTitle className={`text-[${color}]`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {items.map((item, index) => {
            const ItemIconComponent = getItemIcon(index);
            return (
              <div key={index} className='flex items-start gap-2'>
                <ItemIconComponent className={`h-5 w-5 shrink-0 text-[${color}]`} />
                <p className='text-sm text-[#344054]'>{item}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
