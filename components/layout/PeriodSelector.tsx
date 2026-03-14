'use client'

import { useRouter } from 'next/navigation'
import { Button }    from '@/components/ui/button'

interface PeriodSelectorProps {
  current: 'week' | 'month'
}

export function PeriodSelector({ current }: PeriodSelectorProps) {
  const router = useRouter()

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={current === 'week' ? 'default' : 'outline'}
        onClick={() => router.push('/history?period=week')}
      >
        7 días
      </Button>
      <Button
        size="sm"
        variant={current === 'month' ? 'default' : 'outline'}
        onClick={() => router.push('/history?period=month')}
      >
        30 días
      </Button>
    </div>
  )
}
