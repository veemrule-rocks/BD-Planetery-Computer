import { DataTable } from '../DataTable'

export default function DataTableExample() {
  const columns = [
    { key: 'district', label: 'District', sortable: true },
    { key: 'waterLevel', label: 'Water Level (m)', sortable: true },
    { key: 'rainfall', label: 'Rainfall (mm)', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
  ]

  const data = [
    { district: 'Dhaka', waterLevel: '5.2', rainfall: '145', status: 'Normal' },
    { district: 'Chittagong', waterLevel: '6.8', rainfall: '320', status: 'Caution' },
    { district: 'Sylhet', waterLevel: '7.5', rainfall: '450', status: 'Warning' },
    { district: 'Khulna', waterLevel: '4.9', rainfall: '98', status: 'Normal' },
    { district: 'Rajshahi', waterLevel: '3.2', rainfall: '67', status: 'Normal' },
  ]

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={data}
        onExport={() => console.log('Export data')}
      />
    </div>
  )
}
