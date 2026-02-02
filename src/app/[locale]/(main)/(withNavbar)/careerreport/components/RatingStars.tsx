import type { ReactNode } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsItemProps {
  text: string;
  rating: number;
  maxRating?: number;
  additionalText?: string;
}

interface RatingStarsProps {
  title: string;
  titleColor?: string;
  icon: ReactNode;
  items: RatingStarsItemProps[];
  className?: string;
}

export function RatingStars({ title, titleColor = 'text-gray-800', icon, items, className = '' }: RatingStarsProps) {
  return (
    <div className={`border border-gray-200 rounded-2xl p-4 ${className}`}>
      <div className={`flex items-center gap-2 mb-4 ${titleColor}`}>
        {icon}
        <h3 className='text-lg font-semibold'>{title}</h3>
      </div>

      <div className='space-y-4'>
        {items.map((item, index) => (
          <div key={index} className={`flex items-center ${!item.additionalText && 'justify-between'}`}>
            <span className='text-gray-700 font-medium'>{item.text}</span>
            <div className='flex items-center ml-3'>
              <div className='flex'>
                {[...Array(item.maxRating || 5)].map((_, i) => (
                  <div key={i} className='relative'>
                    {i < item.rating ? (
                      <Star
                        fill='#FBB03B'
                        color='#FBB03B'
                        className=' w-6 h-6' // Doubled from w-6 h-6
                      />
                    ) : (
                      <Star
                        fill='transparent'
                        color='#d1d5db'
                        className=' w-6 h-6' // Doubled from w-6 h-6
                      />
                    )}
                  </div>
                ))}
              </div>
              {item.additionalText && <span className='ml-3 text-gray-600'>{item.additionalText}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
