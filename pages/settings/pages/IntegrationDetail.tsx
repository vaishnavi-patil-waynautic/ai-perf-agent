// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import { updateIntegration } from "../store/settings.store";
// import { useState } from "react";
// import IntegrationTokenDialog from "../components/IntegrationTokenDialog";

// export default function IntegrationDetails() {
//   const { integrationId } = useParams<{ integrationId: string }>();
//   const dispatch = useAppDispatch();

//   const integration = useAppSelector(
//     state => state.settings.integrations[integrationId!]
//   );

//   const [open, setOpen] = useState(false);

//   if (!integration) return <div>Invalid integration</div>;

//   return (
//     <div className="max-w-3xl">
//       <h1 className="text-xl font-semibold capitalize mb-4">
//         {integrationId}
//       </h1>

//       <div className={`border rounded-lg p-6 ${
//         integration.connected ? "bg-green-50 border-green-300" : "bg-yellow-50 border-yellow-300"
//       }`}>
//         {integration.connected ? (
//           <>
//             <p className="text-sm">
//               Token: ****{integration.token.slice(-4)}
//             </p>
//             <button
//               className="mt-4 text-blue-600"
//               onClick={() => setOpen(true)}
//             >
//               Edit Token
//             </button>
//           </>
//         ) : (
//           <>
//             <p className="text-sm text-yellow-700">Not connected</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//               onClick={() => setOpen(true)}
//             >
//               Connect
//             </button>
//           </>
//         )}
//       </div>

//       <IntegrationTokenDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         onSubmit={(token) => {
//           dispatch(updateIntegration({ id: integrationId!, token }));
//         }}
//       />
//     </div>
//   );
// }



// import { useParams } from "react-router-dom";
// import { useAppSelector } from "../store/hooks";

// export default function IntegrationDetailPage() {
//   const { integrationId } = useParams<{ integrationId: string }>();
//   const integrations = useAppSelector(state => state.settings.integrations);

//   const integration = integrations.find(i => i.type === integrationId);

//   if (!integration) {
//     return (
//       <div className="text-red-600 font-medium">
//         Invalid integration
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-xl font-semibold mb-4">{integration.name}</h1>

//       {integration.connected ? (
//         <div className="bg-green-50 border border-green-300 p-4 rounded">
//           <p className="text-sm">
//             Token: ****{integration.token?.slice(-4)}
//           </p>
//           <button className="mt-3 text-blue-600">Edit Token</button>
//         </div>
//       ) : (
//         <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
//           <p className="text-sm text-yellow-800">Not integrated</p>
//           <button className="mt-3 text-blue-600">Connect</button>
//         </div>
//       )}
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateIntegration } from "../store/settings.store";
import IntegrationTokenDialog from "../components/IntegrationTokenDialog";

export default function IntegrationDetail() {
  const { integrationId } = useParams<{ integrationId: string }>();
  const dispatch = useAppDispatch();

  const integration = useAppSelector(state =>
    state.settings.integrations.find(i => i.type === integrationId)
  );

  const [open, setOpen] = useState(false);

  if (!integration) {
    return <div className="text-red-500">Invalid integration</div>;
  }

  return (
    // <div className="max-w-2xl">
    //   <h1 className="text-xl font-semibold mb-4">{integration.name}</h1>

    //   {integration.connected ? (
    //     <div className="bg-green-50 border border-green-300 p-4 rounded">
    //       <p className="text-sm">
    //         Token: ****{integration.token?.slice(-4)}
    //       </p>
    //       <button
    //         className="mt-3 text-blue-600"
    //         onClick={() => setOpen(true)}
    //       >
    //         Edit Token
    //       </button>
    //     </div>
    //   ) : (
    //     <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
    //       <p className="text-sm text-yellow-800">Not integrated</p>
    //       <button
    //         className="mt-3 text-blue-600"
    //         onClick={() => setOpen(true)}
    //       >
    //         Connect
    //       </button>
    //     </div>
    //   )}

    //   <IntegrationTokenDialog
    //     open={open}
    //     onClose={() => setOpen(false)}
    //     initialToken={integration.token}
    //     onSave={token =>
    //       dispatch(
    //         updateIntegration({
    //           type: integration.type,
    //           token,
    //         })
    //       )
    //     }
    //   />
    // </div>


    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      {/* Variation 1: Modern Glass Card */}
      {/* <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 1: Modern Glass Card</h2>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{integration.name}</h1>
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Token</p>
              <p className="text-lg font-mono text-gray-900">****{integration.token?.slice(-4)}</p>
            </div>
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Edit Token
            </button>
          </div>
        </div>
      </div>

      {/* Variation 2: Gradient Border Card 
      <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 2: Gradient Border Card</h2>
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{integration.name}</h1>
        <div className="relative bg-white p-6 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-20"></div>
          <div className="absolute inset-[1px] bg-white rounded-xl"></div>
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Active Token</p>
            <p className="text-base font-mono mb-4">****{integration.token?.slice(-4)}</p>
            <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-2">
              Edit Token →
            </button>
          </div>
        </div>
      </div>*/}

      {/* Variation 3: Minimalist Shadow Card 
      <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 3: Minimalist Shadow Card</h2>
        <h1 className="text-xl font-semibold mb-5 text-gray-900">{integration.name}</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Token</p>
          <p className="font-mono text-gray-900 mb-5">****{integration.token?.slice(-4)}</p>
          <button className="text-sm text-blue-600 hover:underline">Edit Token</button>
        </div>
      </div>

      {/* Variation 4: Bold Colored Card 
      <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 4: Bold Colored Card</h2>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{integration.name}</h1>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Authentication Token</p>
              <p className="text-xl font-mono font-semibold">****{integration.token?.slice(-4)}</p>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Active</span>
          </div>
          <button className="mt-5 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Update Token
          </button>
        </div>
      </div>

      {/* Variation 5: Outlined Minimalist 
      <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 5: Outlined Minimalist</h2>
        <h1 className="text-xl font-semibold mb-5 text-gray-800">{integration.name}</h1>
        <div className="border-2 border-gray-300 p-5 rounded-lg bg-white hover:border-blue-500 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Token ID</p>
              <p className="font-mono text-gray-900">****{integration.token?.slice(-4)}</p>
            </div>
            <button className="ml-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium">
              Edit
            </button>
          </div>
        </div>
      </div> */}

      {/* Variation 6: Card with Icon */}
      <div className="max-w-2xl">
        {/* <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 6: Card with Icon</h2> */}
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{integration.name}</h1>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-900">Connected</h3>
                {/* <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span> */}
              </div>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm opacity-90 mb-1">Authentication Token</p>
                  <p className="text-xl font-mono font-semibold">****{integration.token?.slice(-4)}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full" onClick={()=>{console.log("clicked")}}>Active</span>
              </div>
              {/* <p className="text-sm text-gray-600 mb-1">Token</p> */}
              {/* <p className="font-mono text-sm text-gray-900 mb-3">****{integration.token?.slice(-4)}</p> */}
              {/* <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Edit Token
              </button> */}
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Edit Token
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Variation 7: Dark Mode Card */}
      {/* <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 7: Dark Mode Card</h2>
        <h1 className="text-2xl font-bold mb-6 text-white">{integration.name}</h1>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Connected</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">API Token</p>
          <p className="font-mono text-lg text-white mb-5">****{integration.token?.slice(-4)}</p>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Edit Token
          </button>
        </div>
      </div> */}

      {/* Variation 8: Soft Pastel Card */}
      {/* <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 8: Soft Pastel Card</h2>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{integration.name}</h1>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Integration Active</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-1">Token</p>
            <p className="font-mono text-gray-900">****{integration.token?.slice(-4)}</p>
          </div>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Manage Token →
          </button>
        </div>
      </div> */}

      {/* Variation 9: Split Two-Tone Card */}
      {/* <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 9: Split Two-Tone Card</h2>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{integration.name}</h1>
        <div className="flex rounded-xl overflow-hidden shadow-lg">
          <div className="bg-blue-600 p-6 flex items-center justify-center w-1/3">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-white/80 font-medium">Connected</p>
            </div>
          </div>
          <div className="bg-white p-6 flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Token</p>
            <p className="font-mono text-gray-900 mb-4">****{integration.token?.slice(-4)}</p>
            <button className="text-sm font-medium text-blue-600 hover:underline">
              Edit Token
            </button>
          </div>
        </div>
      </div> */}

      {/* Variation 10: Neumorphic Card */}
      {/* <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 10: Neumorphic Card</h2>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{integration.name}</h1>
        <div className="bg-gray-100 p-8 rounded-3xl" style={{ boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff' }}>
          <div className="bg-gray-100 p-5 rounded-2xl mb-5" style={{ boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff' }}>
            <p className="text-xs text-gray-500 font-medium mb-2">API Token</p>
            <p className="font-mono text-gray-900 text-lg">****{integration.token?.slice(-4)}</p>
          </div>
          <button
            className="w-full py-3 bg-gray-100 rounded-xl text-blue-600 font-semibold transition-all"
            style={{ boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff' }}
          >
            Edit Token
          </button>
        </div>
      </div> */}
    </div>
  );
}
