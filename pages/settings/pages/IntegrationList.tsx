import { useNavigate } from "react-router-dom";

const integrations = [
  { id: "github", name: "GitHub" },
  { id: "datadog", name: "Datadog" },
  { id: "jira", name: "Jira" },
  { id: "ado", name: "Azure DevOps" },
  { id: "blazemeter", name: "BlazeMeter" }
];

export default function IntegrationsList() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-xl font-semibold mb-6">Integrations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(i => (
          <div
            key={i.id}
            onClick={() => navigate(`/settings/integrations/${i.id}`)}
            className="cursor-pointer bg-white border rounded-lg p-4 hover:shadow-sm transition"
          >
            <h3 className="font-medium">{i.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage {i.name} integration
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
