export default function AISettings() {
  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">

      {/* Variation 1: Modern Glass Card */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 1: Modern Glass Card</h2>
        <div className="bg-white/70 backdrop-blur border border-gray-200 p-6 rounded-2xl shadow-lg space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Settings</h1>
          <select className="w-full p-2.5 rounded-lg border"> 
            <option>GPT-4</option>
            <option>GPT-3.5</option>
          </select>
          <input className="w-full p-2.5 rounded-lg border" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 2: Gradient Border Card */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 2: Gradient Border Card</h2>
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-20" />
          <div className="relative bg-white p-6 rounded-xl space-y-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Settings
            </h1>
            <select className="w-full border p-2 rounded-md" />
            <input className="w-full border p-2 rounded-md" placeholder="Rate Limit" />
          </div>
        </div>
      </div>

      {/* Variation 3: Minimal Shadow Card */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 3: Minimal Shadow</h2>
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h1 className="text-xl font-semibold">AI Settings</h1>
          <select className="w-full border p-2 rounded" />
          <input className="w-full border p-2 rounded" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 4: Bold Gradient Card */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 4: Bold Gradient</h2>
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl text-white space-y-4">
          <h1 className="text-2xl font-bold">AI Settings</h1>
          <select className="w-full p-2 rounded text-gray-900" />
          <input className="w-full p-2 rounded text-gray-900" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 5: Outlined Minimalist */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 5: Outlined</h2>
        <div className="border-2 border-gray-300 p-6 rounded-lg bg-white space-y-4">
          <h1 className="text-xl font-semibold">AI Settings</h1>
          <select className="w-full border p-2 rounded" />
          <input className="w-full border p-2 rounded" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 6: Card with Icon */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 6: With Icon</h2>
        <div className="bg-white border p-6 rounded-xl shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              🤖
            </div>
            <h1 className="text-xl font-semibold">AI Settings</h1>
          </div>
          <select className="w-full border p-2 rounded" />
          <input className="w-full border p-2 rounded" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 7: Dark Mode Card */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-400 mb-4">Variation 7: Dark Mode</h2>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-white space-y-4">
          <h1 className="text-2xl font-bold">AI Settings</h1>
          <select className="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
          <input className="w-full bg-gray-700 border border-gray-600 p-2 rounded" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 8: Soft Pastel */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 8: Soft Pastel</h2>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border space-y-4">
          <h1 className="text-xl font-bold">AI Settings</h1>
          <select className="w-full p-2 rounded border" />
          <input className="w-full p-2 rounded border" placeholder="Rate Limit" />
        </div>
      </div>

      {/* Variation 9: Split Two-Tone */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 9: Two-Tone</h2>
        <div className="flex rounded-xl overflow-hidden shadow">
          <div className="bg-blue-600 p-6 text-white w-1/3 font-bold">
            AI
          </div>
          <div className="bg-white p-6 flex-1 space-y-3">
            <select className="w-full border p-2 rounded" />
            <input className="w-full border p-2 rounded" placeholder="Rate Limit" />
          </div>
        </div>
      </div>

      {/* Variation 10: Neumorphic */}
      <div className="max-w-2xl">
        <h2 className="text-sm text-gray-500 mb-4">Variation 10: Neumorphic</h2>
        <div
          className="bg-gray-100 p-8 rounded-3xl space-y-4"
          style={{
            boxShadow:
              "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
          }}
        >
          <h1 className="text-xl font-semibold text-gray-800">AI Settings</h1>
          <input className="w-full p-3 rounded-xl" placeholder="Rate Limit" />
          <select className="w-full p-3 rounded-xl" />
        </div>
      </div>

    </div>
  );
}
