import { Integration } from "../types/settings.types";

export default function IntegrationCard({ integration, onConnect, onEdit }: { integration: Integration, onConnect?: () => void, onEdit?: () => void }) {
  return (
    <div className={`border rounded-lg p-4 ${integration.connected ? "border-green-300 bg-green-50" : "border-yellow-300 bg-yellow-50"}`}>
      <h3 className="font-medium">{integration.name}</h3>
      {integration.connected ? (
        <>
          <p className="text-sm mt-2">Token: ****{integration.token?.slice(-4)}</p>
          <button className="text-blue-600 text-sm mt-3" onClick={onEdit}>Edit Token</button>
        </>
      ) : (
        <>
          <p className="text-sm mt-2 text-yellow-700">Not integrated</p>
          <button className="text-blue-600 text-sm mt-3" onClick={onConnect}>Integrate</button>
        </>
      )}
    </div>
  );
}
