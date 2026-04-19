import React, { useState } from 'react';
import { BookingConcierge } from './BookingConcierge';
import { MaintenanceTriage } from './MaintenanceTriage';
import { AdminApproval } from './AdminApproval';
import { KnowledgeBaseChat } from './KnowledgeBaseChat';
import { Calendar, Wrench, ShieldAlert, BookOpen, Sparkles, ChevronRight, Bot } from 'lucide-react';

export function AITester() {
  const [activeTab, setActiveTab] = useState('booking');

  const tabs = [
    { 
      id: 'booking', 
      label: 'Booking Concierge', 
      description: 'Find and reserve campus facilities effortlessly.',
      icon: Calendar, 
      color: 'text-blue-600',
      activeBg: 'bg-blue-50',
      activeBorder: 'border-blue-200'
    },
    { 
      id: 'triage', 
      label: 'Maintenance Triage', 
      description: 'Report issues and get instant categorization.',
      icon: Wrench, 
      color: 'text-amber-600',
      activeBg: 'bg-amber-50',
      activeBorder: 'border-amber-200'
    },
    { 
      id: 'approval', 
      label: 'Admin Approvals', 
      description: 'Review and process pending campus requests.',
      icon: ShieldAlert, 
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50',
      activeBorder: 'border-indigo-200'
    },
    { 
      id: 'rag', 
      label: 'Knowledge Base', 
      description: 'Ask questions about campus policies and rules.',
      icon: BookOpen, 
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50',
      activeBorder: 'border-emerald-200'
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/80 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1600px] w-full mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4 sm:px-6 sm:py-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 text-white/10 pointer-events-none">
              <Bot className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1">
                  Smart Campus AI Assistant
                </h1>
                <p className="max-w-2xl text-sm text-blue-100">
                  Select a specialized AI agent below to handle your campus needs.
                </p>
              </div>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20 self-start sm:self-auto">
                <Sparkles className="w-3 h-3 text-blue-100" />
                <span className="text-blue-50">Powered by LangGraph</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified App Container */}
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-230px)] min-h-[550px] mb-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/80 flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3 pt-2">
                Available Agents
              </h2>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between text-left px-3 py-3 rounded-xl transition-all duration-200 border ${
                        isActive 
                          ? `${tab.activeBg} ${tab.activeBorder} shadow-sm ring-1 ring-black/5` 
                          : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-gray-200/50'} ${tab.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                            {tab.label}
                          </h3>
                          <p className={`text-xs mt-0.5 ${isActive ? 'text-gray-600' : 'text-gray-500'} line-clamp-2`}>
                            {tab.description}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className={`w-5 h-5 ${tab.color} opacity-70 shrink-0`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Agent Area */}
          <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
            <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
              {activeTab === 'booking' && <BookingConcierge />}
              {activeTab === 'triage' && <MaintenanceTriage />}
              {activeTab === 'approval' && <AdminApproval />}
              {activeTab === 'rag' && <KnowledgeBaseChat />}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}