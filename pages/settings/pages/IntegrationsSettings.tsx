import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import IntegrationCard from "../components/IntegrationCard";

export default function IntegrationsSettings() {
  const integrations = useSelector((state: RootState) => state.settings.integrations);

  return (
    <>
      <h1 className="text-xl font-semibold mb-6">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(i => (
          <IntegrationCard key={i.type} integration={i} onConnect={() => {}} onEdit={() => {}} />
        ))}
      </div>
    </>
  );
}
