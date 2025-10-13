import { LayerControlPanel } from '../LayerControlPanel'

export default function LayerControlPanelExample() {
  return (
    <div className="p-4">
      <LayerControlPanel
        onLayerChange={(layers) => console.log('Layers changed:', layers)}
      />
    </div>
  )
}
