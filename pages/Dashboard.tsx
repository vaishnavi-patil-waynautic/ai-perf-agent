import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, ShieldCheck, FileCode } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedApp, selectedProject } = useSelector((state: RootState) => state.project);

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-medium mb-2">No Project Selected</h2>
        <p>Please select a project from the top navigation bar to get started.</p>
      </div>
    );
  }

  if (!selectedApp) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-medium mb-2">No Application Selected</h2>
        <p>Select an application from the sidebar to view available tools.</p>
      </div>
    );
  }

  const tools = [
    { 
      id: 'autoscript', 
      title: 'AutoScript', 
      desc: 'Generate JMX scripts from HAR files automatically.',
      icon: <Zap size={24} className="text-yellow-600" />,
      color: 'bg-yellow-50 hover:border-yellow-300',
      action: () => navigate('/autoscript')
    },
    { 
      id: 'analysis', 
      title: 'Auto Analysis', 
      desc: 'Analyze performance test results with AI insights.',
      icon: <Activity size={24} className="text-purple-600" />,
      color: 'bg-purple-50 hover:border-purple-300',
      action: () => navigate('/nfr')
    },
    { 
      id: 'governance', 
      title: 'Governance', 
      desc: 'Monitor compliance and NFR standards across pipelines.',
      icon: <ShieldCheck size={24} className="text-green-600" />,
      color: 'bg-green-50 hover:border-green-300',
      action: () => alert('Module coming soon')
    },
    { 
      id: 'scripting', 
      title: 'Scripting Helper', 
      desc: 'AI assistant for writing complex performance logic.',
      icon: <FileCode size={24} className="text-blue-600" />,
      color: 'bg-blue-50 hover:border-blue-300',
      action: () => alert('Module coming soon')
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">{selectedApp.name}</h1>
        <p className="text-gray-500">Project: {selectedProject.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={tool.action}
            className={`
              relative p-6 rounded-xl border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm bg-white hover:shadow-md
              ${tool.color}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                {tool.icon}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-600">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;