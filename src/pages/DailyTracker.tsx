import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { mockDailyActivities, mockLeads, mockPartners, mockUsers } from '../data/mockData';
import { DailyActivity } from '../types';
import { useForm } from 'react-hook-form';

const DailyTracker: React.FC = () => {
  const [activities, setActivities] = useState<DailyActivity[]>(mockDailyActivities);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<DailyActivity, 'id' | 'createdAt'>>();
  
  const addActivity = (data: Omit<DailyActivity, 'id' | 'createdAt'>) => {
    const newActivity: DailyActivity = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setActivities([newActivity, ...activities]);
    setIsAddActivityModalOpen(false);
    reset();
  };
  
  const filteredActivities = activities.filter(
    (activity) => activity.date === selectedDate
  );
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Call':
        return <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">C</div>;
      case 'Meeting':
        return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">M</div>;
      case 'Email':
        return <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">E</div>;
      case 'Task':
        return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">T</div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">O</div>;
    }
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    
    return `${mins}m`;
  };
  
  const getLeadName = (leadId: string | null) => {
    if (!leadId) return null;
    const lead = mockLeads.find((l) => l.id === leadId);
    return lead ? lead.name : null;
  };
  
  const getPartnerName = (partnerId: string | null) => {
    if (!partnerId) return null;
    const partner = mockPartners.find((p) => p.id === partnerId);
    return partner ? partner.name : null;
  };
  
  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  return (
    <div>
      <PageHeader 
        title="Daily Progress Tracker" 
        description="Log and track your daily activities"
        actions={
          <button
            type="button"
            onClick={() => setIsAddActivityModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </button>
        }
      />
      
      {/* Date selector */}
      <Card className="mb-6">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <label htmlFor="date-selector" className="block text-sm font-medium text-gray-700 mr-4">
            Select Date:
          </label>
          <input
            id="date-selector"
            type="date"
            className="input max-w-xs"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </Card>
      
      {/* Activity list */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">
          Activities for {format(new Date(selectedDate), 'MMMM d, yyyy')}
        </h2>
        
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="relative hover:shadow-md transition-shadow duration-200">
                <div className="flex">
                  {getActivityIcon(activity.activityType)}
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.activityType}</h3>
                        <p className="text-sm text-gray-500">
                          {getUserName(activity.userId)} • {formatDuration(activity.duration)}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(activity.createdAt), 'h:mm a')}
                      </span>
                    </div>
                    
                    <p className="mt-2">{activity.description}</p>
                    
                    {(activity.leadId || activity.partnerId) && (
                      <p className="mt-1 text-sm text-gray-600">
                        {activity.leadId && (
                          <span className="mr-2">
                            <span className="font-medium">Lead:</span> {getLeadName(activity.leadId)}
                          </span>
                        )}
                        {activity.partnerId && (
                          <span>
                            <span className="font-medium">Partner:</span> {getPartnerName(activity.partnerId)}
                          </span>
                        )}
                      </p>
                    )}
                    
                    {activity.outcome && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium">Outcome:</span> {activity.outcome}
                      </p>
                    )}
                    
                    {activity.nextSteps && (
                      <p className="mt-1 text-sm">
                        <span className="font-medium">Next Steps:</span> {activity.nextSteps}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-500">No activities logged for this date.</p>
          </Card>
        )}
      </div>
      
      {/* Add Activity Modal */}
      <Modal
        isOpen={isAddActivityModalOpen}
        onClose={() => {
          setIsAddActivityModalOpen(false);
          reset();
        }}
        title="Log New Activity"
        size="lg"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline mr-3"
              onClick={() => {
                setIsAddActivityModalOpen(false);
                reset();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit(addActivity)}
            >
              Log Activity
            </button>
          </>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type
            </label>
            <select
              id="activityType"
              className={`select ${errors.activityType ? 'border-red-500' : ''}`}
              {...register('activityType', { required: true })}
            >
              <option value="">Select activity type</option>
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Email">Email</option>
              <option value="Task">Task</option>
              <option value="Other">Other</option>
            </select>
            {errors.activityType && <p className="mt-1 text-sm text-red-600">Activity type is required</p>}
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              className={`input ${errors.date ? 'border-red-500' : ''}`}
              defaultValue={selectedDate}
              {...register('date', { required: true })}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">Date is required</p>}
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              min="1"
              className={`input ${errors.duration ? 'border-red-500' : ''}`}
              {...register('duration', { required: true, min: 1 })}
            />
            {errors.duration?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Duration is required</p>
            )}
            {errors.duration?.type === 'min' && (
              <p className="mt-1 text-sm text-red-600">Duration must be at least 1 minute</p>
            )}
          </div>
          
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <select
              id="userId"
              className="select"
              defaultValue="1"
              {...register('userId', { required: true })}
            >
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="leadId" className="block text-sm font-medium text-gray-700 mb-1">
              Related Lead (optional)
            </label>
            <select
              id="leadId"
              className="select"
              {...register('leadId')}
            >
              <option value="">None</option>
              {mockLeads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.company}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700 mb-1">
              Related Partner (optional)
            </label>
            <select
              id="partnerId"
              className="select"
              {...register('partnerId')}
            >
              <option value="">None</option>
              {mockPartners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className={`input ${errors.description ? 'border-red-500' : ''}`}
              {...register('description', { required: true })}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">Description is required</p>}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-1">
              Outcome
            </label>
            <textarea
              id="outcome"
              rows={2}
              className="input"
              {...register('outcome')}
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="nextSteps" className="block text-sm font-medium text-gray-700 mb-1">
              Next Steps
            </label>
            <textarea
              id="nextSteps"
              rows={2}
              className="input"
              {...register('nextSteps')}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DailyTracker;