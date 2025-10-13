import { DateRangeSelector } from '../DateRangeSelector'

export default function DateRangeSelectorExample() {
  return (
    <div className="p-4">
      <DateRangeSelector
        onDateRangeChange={(range) => console.log('Date range changed:', range)}
      />
    </div>
  )
}
