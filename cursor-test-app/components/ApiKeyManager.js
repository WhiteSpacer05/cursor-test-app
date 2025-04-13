'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CreateApiKeyModal from './CreateApiKeyModal';
import Snackbar from './Snackbar';

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', key: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    show: false, 
    message: '', 
    type: 'default' 
  });

  // Load API keys from Supabase on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Auto-hide snackbar after 3 seconds
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show]);

  const showNotification = (message, type = 'default') => {
    setSnackbar({
      show: true,
      message,
      type
    });
  };

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (newApiKey) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([{
          name: newApiKey.name,
          key: newApiKey.key,
          type: newApiKey.type,
          usage: '0',
        }])
        .select()
        .single();

      if (error) throw error;
      setApiKeys(prev => [data, ...prev]);
      setIsModalOpen(false);
      showNotification('API key created successfully', 'success');
    } catch (err) {
      console.error('Error creating API key:', err);
      showNotification('Failed to create API key', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApiKeys(prev => prev.filter(key => key.id !== id));
      setVisibleKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      showNotification('API key deleted', 'error');
    } catch (err) {
      console.error('Error deleting API key:', err);
      showNotification('Failed to delete API key', 'error');
    }
  };

  const startEditing = (apiKey) => {
    setEditingKey(apiKey.id);
    setEditValues({ name: apiKey.name, key: apiKey.key });
  };

  const handleUpdate = async (id) => {
    if (!editValues.key.trim() || !editValues.name.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({ 
          key: editValues.key,
          name: editValues.name 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setApiKeys(prev => prev.map(key => 
        key.id === id ? data : key
      ));
      setEditingKey(null);
      setEditValues({ name: '', key: '' });
    } catch (err) {
      console.error('Error updating API key:', err);
      showNotification('Failed to update API key', 'error');
    }
  };

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      showNotification('API key copied to clipboard!');
    } catch (err) {
      showNotification('Failed to copy API key', 'error');
    }
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-500">Loading API keys...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
          >
            <span>+</span> Create API Key
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">NAME</th>
                <th className="pb-3 font-medium">TYPE</th>
                <th className="pb-3 font-medium">USAGE</th>
                <th className="pb-3 font-medium">KEY</th>
                <th className="pb-3 font-medium text-right">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="border-b last:border-b-0">
                  <td className="py-4 text-sm">
                    {editingKey === apiKey.id ? (
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-1 border rounded"
                        placeholder="Enter name"
                      />
                    ) : (
                      apiKey.name
                    )}
                  </td>
                  <td className="py-4 text-sm">{apiKey.type}</td>
                  <td className="py-4 text-sm">{apiKey.usage}</td>
                  <td className="py-4 text-sm font-mono">
                    {editingKey === apiKey.id ? (
                      <input
                        type="text"
                        value={editValues.key}
                        onChange={(e) => setEditValues(prev => ({ ...prev, key: e.target.value }))}
                        className="w-full p-1 border rounded"
                        placeholder="Enter API key"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          {visibleKeys.has(apiKey.id) 
                            ? apiKey.key
                            : `${apiKey.key.substring(0, 10)}•••••••••••••••••`
                          }
                        </span>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={visibleKeys.has(apiKey.id) ? "Hide API Key" : "Show API Key"}
                        >
                          {visibleKeys.has(apiKey.id) ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingKey === apiKey.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(apiKey.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingKey(null);
                              setEditValues({ name: '', key: '' });
                            }}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopyKey(apiKey.key)}
                            className="text-gray-600 hover:text-gray-700"
                            title="Copy"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => startEditing(apiKey)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(apiKey.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {apiKeys.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No API keys found. Create your first API key using the button above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateKey}
      />

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        position="top"
        isVisible={snackbar.show}
        onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
} 