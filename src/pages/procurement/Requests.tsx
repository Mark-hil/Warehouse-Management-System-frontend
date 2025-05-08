import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, Select, TextArea, Button } from '../../components/forms';

interface ProcurementRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  requester: string;
  department: string;
  createdAt: string;
  notes: string;
}

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    urgency: 'medium',
    department: '',
    notes: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/procurement/requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/procurement/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({
        itemName: '',
        quantity: '',
        urgency: 'medium',
        department: '',
        notes: ''
      });
      fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/procurement/requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getUrgencyBadge = (urgency: ProcurementRequest['urgency']) => {
    const config: Record<ProcurementRequest['urgency'], string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${config[urgency]}`}>
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </span>
    );
  };

  const getStatusClass = (status: ProcurementRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
      case 'rejected':
        return 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
      default:
        return 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ProcurementRequest['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const columns: Column<ProcurementRequest>[] = [
    {
      header: 'Request',
      accessor: (row: ProcurementRequest) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-2 text-blue-500" />
          <div>
            <div className="font-medium">{row.requestNumber}</div>
            <div className="text-sm text-gray-500">{row.itemName}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Quantity',
      accessor: (row: ProcurementRequest) => (
        <span className="font-medium">{row.quantity}</span>
      )
    },
    {
      header: 'Urgency',
      accessor: (row: ProcurementRequest) => getUrgencyBadge(row.urgency)
    },
    {
      header: 'Requester',
      accessor: (row: ProcurementRequest) => (
        <div>
          <div className="font-medium">{row.requester}</div>
          <div className="text-sm text-gray-500">{row.department}</div>
        </div>
      )
    },
    {
      header: 'Created',
      accessor: (row: ProcurementRequest) => (
        new Date(row.createdAt).toLocaleDateString()
      )
    },
    {
      header: 'Status',
      accessor: (row: ProcurementRequest) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(row.status)}
          <span className={getStatusClass(row.status)}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: ProcurementRequest) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange(row.id, 'approved')}
            className="p-1 text-green-600 hover:text-green-800"
            disabled={row.status !== 'pending'}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStatusChange(row.id, 'rejected')}
            className="p-1 text-red-600 hover:text-red-800"
            disabled={row.status !== 'pending'}
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: ProcurementRequest) => (
        row.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => handleStatusChange(row.id, 'approved')}
              className="min-w-0 p-2"
            >
              <CheckCircle size={16} className="text-green-600" />
            </Button>
            <Button
              variant="danger"
              onClick={() => handleStatusChange(row.id, 'rejected')}
              className="min-w-0 p-2"
            >
              <XCircle size={16} />
            </Button>
          </div>
        )
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement Requests</h1>
          <p className="text-gray-600">Manage procurement requests from departments</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2" size={16} />
          New Request
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={requests}
          emptyMessage="No requests found"
          keyExtractor={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Procurement Request"
      >
        <Form
          onSubmit={handleSubmit}
          title="New Procurement Request"
          description="Enter the procurement request details below"
        >
          <Input
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, itemName: e.target.value })}
            placeholder="Enter item name"
            required
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Enter quantity needed"
            required
          />
          <Select
            label="Urgency"
            name="urgency"
            value={formData.urgency}
            onChange={(value: string) => setFormData({ ...formData, urgency: value as ProcurementRequest['urgency'] })}
            required
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
          />
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Enter department name"
            required
          />
          <TextArea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter any additional notes"
            rows={3}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Requests;
