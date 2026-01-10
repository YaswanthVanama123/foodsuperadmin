import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PlansGrid, PlanForm } from '../components/plans';
import plansApi, { Plan, CreatePlanRequest } from '../api/plans.api';

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      // Prevent concurrent requests
      if (isFetching.current) return;

      try {
        isFetching.current = true;
        setIsLoading(true);
        setError(null);

        console.log('[Plans] Fetching plans from API...');
        const response = await plansApi.getAll();
        console.log('[Plans] API response:', response);

        if (response && response.plans) {
          setPlans(response.plans);
        } else {
          console.error('[Plans] Invalid response structure:', response);
          setPlans([]);
          setError('Invalid response from server');
        }
      } catch (err: any) {
        console.error('[Plans] Error fetching plans:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load plans');
        setPlans([]);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    };

    fetchPlans();
  }, []);

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      searchQuery === '' ||
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateNew = () => {
    setFormMode('create');
    setSelectedPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setFormMode('edit');
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = async (plan: Plan) => {
    if (window.confirm(`Are you sure you want to delete the "${plan.name}" plan? This action cannot be undone.`)) {
      try {
        await plansApi.delete(plan._id);
        alert('Plan deleted successfully');
        // Refresh plans
        const response = await plansApi.getAll();
        if (response && response.plans) {
          setPlans(response.plans);
        }
      } catch (err: any) {
        alert(`Failed to delete plan: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleFormSubmit = async (data: CreatePlanRequest) => {
    try {
      if (formMode === 'create') {
        await plansApi.create(data);
        alert('Plan created successfully');
      } else {
        await plansApi.update(selectedPlan!._id, data);
        alert('Plan updated successfully');
      }

      setIsFormOpen(false);
      setSelectedPlan(null);

      // Refresh plans
      const response = await plansApi.getAll();
      if (response && response.plans) {
        setPlans(response.plans);
      }
    } catch (err: any) {
      alert(`Failed to ${formMode} plan: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSeedPlans = async () => {
    if (plans.length > 0) {
      if (!window.confirm('This will delete all existing plans and create default plans. Are you sure?')) {
        return;
      }
    }

    try {
      setIsLoading(true);
      console.log('[Plans] Seeding plans...');
      const result = await plansApi.seed();
      console.log('[Plans] Seed result:', result);
      alert(`Successfully seeded ${result.plans.length} plans`);

      // Refresh plans
      const response = await plansApi.getAll();
      if (response && response.plans) {
        setPlans(response.plans);
      }
    } catch (err: any) {
      console.error('[Plans] Error seeding plans:', err);
      alert(`Failed to seed plans: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const activePlans = plans.filter((p) => p.isActive);
  const inactivePlans = plans.filter((p) => !p.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Create and manage subscription plans for restaurants</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Plans</p>
            <p className="text-3xl font-bold text-gray-900">{plans.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm text-green-100 mb-1">Active Plans</p>
            <p className="text-3xl font-bold">{activePlans.length}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm text-gray-100 mb-1">Inactive Plans</p>
            <p className="text-3xl font-bold">{inactivePlans.length}</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Create Button */}
            <Button onClick={handleCreateNew} className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Plan</span>
            </Button>
          </div>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading plans...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Active Plans */}
            {activePlans.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Plans</h2>
                <PlansGrid plans={activePlans} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            )}

            {/* Inactive Plans */}
            {inactivePlans.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Inactive Plans</h2>
                <PlansGrid plans={inactivePlans} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            )}

            {/* Empty State */}
            {filteredPlans.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'No plans match your search' : 'No plans available'}
                </p>
                {!searchQuery && (
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleSeedPlans} className="flex items-center space-x-2" variant="outline">
                      <Plus className="h-5 w-5" />
                      <span>Seed Default Plans (Free, Basic, Pro, Enterprise)</span>
                    </Button>
                    <Button onClick={handleCreateNew} className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Create Custom Plan</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Plan Form Modal */}
        <PlanForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPlan(null);
          }}
          onSubmit={handleFormSubmit}
          mode={formMode}
          initialData={selectedPlan || undefined}
        />
      </div>
    </div>
  );
};

export default Plans;
