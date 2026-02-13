import { NavLink } from "react-router-dom";

const integrations = [
    { id: "github", label: "GitHub" },
    { id: "datadog", label: "Datadog" },
    { id: "jira", label: "Jira" },
    { id: "ado", label: "Azure DevOps" },
    { id: "blazemeter", label: "BlazeMeter" },
];

export default function SettingsSidebar() {
    return (
        <div className="w-64 border-r bg-white p-4 space-y-6">
            {/* Applications */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">APPLICATION</h3>
                <NavLink to="/settings/applications" className="block py-2 text-sm">
                    Applications
                </NavLink>
            </div>

            {/* Integrations */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">INTEGRATIONS</h3>
                {/* {integrations.map(i => (
                    <NavLink
                        key={i.id}
                        to={`/settings/integrations/${i.id}`}
                        className="block py-2 text-sm capitalize"
                    >
                        {i.label}
                    </NavLink>
                ))} */}

                <NavLink to="/settings/integrations" className="block py-2 text-sm">
                    Integrations
                </NavLink>
            </div>

            {/* User */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">USER</h3>
                <NavLink to="/settings/profile" className="block py-2 text-sm">
                    Profile
                </NavLink>
            </div>


            <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">AI</h3>

                <NavLink to="/settings/ai" className="block py-2 text-sm">
                    AI Settings
                </NavLink>
            </div>
        </div>
    );
}
