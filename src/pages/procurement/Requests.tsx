import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, Select, Button } from '../../components/forms';
import { ProcurementRequestItem, Item } from '../../types/procurement.types';
import { ProcurementService } from '../../services/procurement.service';
import { ProcurementRequest } from '../../types/procurement.types';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';



const Requests: React.FC = () => {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProcurementRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: number; status: 'approved' | 'rejected' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    required_by: format(new Date().setDate(new Date().getDate() + 14), 'yyyy-MM-dd'),
    description: '',
    items: [{ item: '', requested_quantity: '' }]
  });
  const [formErrors, setFormErrors] = useState<{
    required_by?: string;
    description?: string;
    items?: { item?: string; requested_quantity?: string }[];
  }>({});

  useEffect(() => {
    fetchRequests();
    fetchItems();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status === statusFilter));
    }
  }, [statusFilter, requests]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const procurementService = ProcurementService.getInstance();
      const data = await procurementService.getProcurementRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch procurement requests');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const procurementService = ProcurementService.getInstance();
      const data = await procurementService.getItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch items');
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item: '', requested_quantity: '' }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: 'item' | 'requested_quantity', value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };

  const validateForm = () => {
    const errors: {
      required_by?: string;
      description?: string;
      items?: { item?: string; requested_quantity?: string }[];
    } = {};

    // Validate required_by date
    const requiredByDate = new Date(formData.required_by);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requiredByDate < today) {
      errors.required_by = 'Required by date cannot be in the past';
    }

    // Validate items
    const itemErrors = formData.items.map(item => {
      const error: { item?: string; requested_quantity?: string } = {};
      if (!item.item) {
        error.item = 'Please select an item';
      }
      if (!item.requested_quantity) {
        error.requested_quantity = 'Please enter a quantity';
      } else if (parseInt(item.requested_quantity) <= 0) {
        error.requested_quantity = 'Quantity must be greater than 0';
      }
      return error;
    });

    if (itemErrors.some(error => Object.keys(error).length > 0)) {
      errors.items = itemErrors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      required_by: format(new Date().setDate(new Date().getDate() + 14), 'yyyy-MM-dd'),
      description: '',
      items: [{ item: '', requested_quantity: '' }]
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        toast.error('Please fix the errors in the form');
        return;
      }

      setIsLoading(true);
      const procurementService = ProcurementService.getInstance();

      // First create the procurement request
      const request = {
        request_date: format(new Date(), 'yyyy-MM-dd'),
        required_by: formData.required_by,
        description: formData.description,
        status: 'pending' as const,
        requested_by: 1, // TODO: Get from auth context
        items: [] as ProcurementRequestItem[]
      };

      const newRequest = await procurementService.createProcurementRequest(request);

      // Then create all procurement items
      if (newRequest.procurement_id) {
        await Promise.all(formData.items.map(item => 
          procurementService.createProcurementRequestItem({
            procurement: newRequest.procurement_id,
            item: parseInt(item.item),
            requested_quantity: parseInt(item.requested_quantity)
          })
        ));
      }

      toast.success('Procurement request created successfully');
      setIsModalOpen(false);
      resetForm();
      fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create procurement request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      const procurementService = ProcurementService.getInstance();
      await procurementService.updateProcurementRequest(id, {
        status,
        approved_by: status === 'approved' ? 1 : undefined // TODO: Get from auth context
      });
      toast.success(`Request ${status} successfully`);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error(`Failed to ${status} request`);
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };

  const openConfirmDialog = (id: number, status: 'approved' | 'rejected') => {
    setConfirmAction({ id, status });
    setIsConfirmDialogOpen(true);
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
            <div className="font-medium">PR-{row.procurement_id}</div>
            <div className="text-sm text-gray-500">
              {row.items && row.items[0]?.item_details?.name || 'No items'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Quantity',
      accessor: (row: ProcurementRequest) => row.items && row.items[0]?.requested_quantity || 0
    },
    {
      header: 'Required By',
      accessor: (row: ProcurementRequest) => format(new Date(row.required_by), 'MMM dd, yyyy')
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
      header: 'Requester',
      accessor: (row: ProcurementRequest) => row.requested_by_details?.username || 'Unknown'
    },
    {
      header: 'Request Date',
      accessor: (row: ProcurementRequest) => format(new Date(row.request_date), 'MMM dd, yyyy')
    },
    {
      header: 'Actions',
      accessor: (row: ProcurementRequest) => (
        row.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => openConfirmDialog(row.procurement_id, 'approved')}
              className="min-w-0 p-2"
              disabled={isLoading}
            >
              <CheckCircle size={16} className="text-green-600" />
            </Button>
            <Button
              variant="danger"
              onClick={() => openConfirmDialog(row.procurement_id, 'rejected')}
              className="min-w-0 p-2"
              disabled={isLoading}
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
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Procurement Requests</h1>
          <Select
            label="Filter by Status"
            value={statusFilter}
            onChange={(value: string) => setStatusFilter(value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]}
            className="w-40"
          />
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
          data={filteredRequests}
          emptyMessage="No requests found"
          keyExtractor={(item) => item.procurement_id.toString()}
          isLoading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="New Procurement Request"
      >
        <Form
          onSubmit={handleSubmit}
          title="New Procurement Request"
          description="Enter the procurement request details below"
        >
          <Input
            label="Required By"
            name="required_by"
            type="date"
            value={formData.required_by}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, required_by: e.target.value });
              setFormErrors(prev => ({ ...prev, required_by: undefined }));
            }}
            error={formErrors.required_by}
            required
          />

          <Input
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setFormData({ ...formData, description: e.target.value });
              setFormErrors(prev => ({ ...prev, description: undefined }));
            }}
            placeholder="Enter any additional notes or requirements"
          />
          
          {formData.items.map((item, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-1">
                <Select
                  label={`Item ${index + 1}`}
                  name={`item-${index}`}
                  value={item.item}
                  onChange={(value: string) => {
                    handleItemChange(index, 'item', value);
                    setFormErrors(prev => ({
                      ...prev,
                      items: prev.items?.map((error, i) => 
                        i === index ? { ...error, item: undefined } : error
                      )
                    }));
                  }}
                  required
                  options={items.map(i => ({ value: i.item_id.toString(), label: i.name }))}
                  error={formErrors.items?.[index]?.item}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Quantity"
                  name={`quantity-${index}`}
                  type="number"
                  value={item.requested_quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleItemChange(index, 'requested_quantity', e.target.value);
                    setFormErrors(prev => ({
                      ...prev,
                      items: prev.items?.map((error, i) => 
                        i === index ? { ...error, requested_quantity: undefined } : error
                      )
                    }));
                  }}
                  placeholder="Enter quantity needed"
                  error={formErrors.items?.[index]?.requested_quantity}
                  required
                  min="1"
                />
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="danger"
                  className="mb-4"
                  onClick={() => handleRemoveItem(index)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            className="mt-2"
          >
            <Plus className="mr-2" size={16} />
            Add Another Item
          </Button>
        </Form>
      </Modal>

      <Modal
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
        title={`Confirm ${confirmAction?.status === 'approved' ? 'Approval' : 'Rejection'}`}
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to {confirmAction?.status === 'approved' ? 'approve' : 'reject'} this procurement request?
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setConfirmAction(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction?.status === 'approved' ? 'primary' : 'danger'}
              onClick={() => confirmAction && handleStatusChange(confirmAction.id, confirmAction.status)}
              disabled={isLoading}
            >
              {confirmAction?.status === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Requests;
