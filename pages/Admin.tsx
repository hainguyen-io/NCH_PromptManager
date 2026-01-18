import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store';
import { UserProfile, UserStatus } from '../types';
import { Shield, CheckCircle, XCircle, Clock, Search, User, Mail, Calendar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import ConfirmationModal from '../components/ConfirmationModal';

const Admin = () => {
  const { userProfile, approveUser, rejectUser } = useAuthStore();
  const { setToastMessage } = useUIStore();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | UserStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which user action is loading
  const [actionError, setActionError] = useState<{ userId: string; error: string; action: 'approve' | 'reject' } | null>(null);
  
  // Sorting state
  const [sortField, setSortField] = useState<'name' | 'email' | 'status' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Confirmation modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    userId: string | null;
    action: 'approve' | 'reject' | null;
    userName: string;
    reason: string;
  }>({
    isOpen: false,
    userId: null,
    action: null,
    userName: '',
    reason: '',
  });

  // Real-time users listener
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      setLoading(true);
      
      // Setup real-time listener
      const unsubscribe = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          console.log('📊 Users snapshot received:', {
            totalDocs: snapshot.docs.length,
            docs: snapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data()
            }))
          });
          
          const users = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as UserProfile[];
          
          console.log('✅ Processed users:', users.length, users);
          setAllUsers(users);
          setLoading(false);
        },
        (error) => {
          console.error('❌ Error listening to users:', error);
          setToastMessage('Error loading users');
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } else {
      console.log('⚠️ User is not admin, skipping listener setup');
    }
  }, [userProfile, setToastMessage]);

  // Memoized filtered and sorted users for performance
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = allUsers;

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter((user) => user.status === filter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = a.createdAt || 0;
          bValue = b.createdAt || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allUsers, filter, searchQuery, sortField, sortDirection]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  // Pagination info
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  
  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Memoized stats for performance
  const stats = useMemo(() => ({
    total: allUsers.length,
    pending: allUsers.filter((u) => u.status === 'pending').length,
    approved: allUsers.filter((u) => u.status === 'approved').length,
    rejected: allUsers.filter((u) => u.status === 'rejected').length,
  }), [allUsers]);

  // Handle sort
  const handleSort = (field: 'name' | 'email' | 'status' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: 'name' | 'email' | 'status' | 'createdAt') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  // Open confirmation modal
  const openConfirmModal = (userId: string, action: 'approve' | 'reject', userName: string) => {
    setModalState({
      isOpen: true,
      userId,
      action,
      userName,
      reason: '',
    });
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    if (!actionLoading) {
      setModalState({
        isOpen: false,
        userId: null,
        action: null,
        userName: '',
        reason: '',
      });
    }
  };

  // Handle approve with optimistic update and loading state
  const handleApprove = async (userId: string) => {
    closeConfirmModal();

    setActionLoading(userId);
    setActionError(null);

    // Optimistic update - update UI immediately
    const userToApprove = allUsers.find(u => u.id === userId);
    if (userToApprove) {
      setAllUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: 'approved' as UserStatus, approvedAt: Date.now() }
          : u
      ));
    }

    try {
      await approveUser(userId);
      setToastMessage('User approved successfully');
      setActionLoading(null);
      // Real-time listener will automatically update the list
    } catch (error: any) {
      // Rollback on error
      if (userToApprove) {
        setAllUsers(prev => prev.map(u => 
          u.id === userId ? userToApprove : u
        ));
      }
      console.error('Error approving user:', error);
      
      // Detailed error handling
      let errorMessage = 'Error approving user';
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to approve users';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'not-found') {
        errorMessage = 'User not found. The user may have been deleted.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setActionError({ userId, error: errorMessage, action: 'approve' });
      setToastMessage(errorMessage);
      setActionLoading(null);
    }
  };

  // Retry failed action
  const handleRetry = async (userId: string, action: 'approve' | 'reject') => {
    setActionError(null);
    if (action === 'approve') {
      await handleApprove(userId);
    } else {
      await handleReject(userId);
    }
  };

  // Handle reject with optimistic update and loading state
  const handleReject = async (userId: string, reason?: string) => {
    closeConfirmModal();

    setActionLoading(userId);
    setActionError(null);

    // Optimistic update - update UI immediately
    const userToReject = allUsers.find(u => u.id === userId);
    if (userToReject) {
      setAllUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: 'rejected' as UserStatus }
          : u
      ));
    }

    try {
      await rejectUser(userId);
      setToastMessage('User rejected successfully');
      setActionLoading(null);
      // Real-time listener will automatically update the list
    } catch (error: any) {
      // Rollback on error
      if (userToReject) {
        setAllUsers(prev => prev.map(u => 
          u.id === userId ? userToReject : u
        ));
      }
      console.error('Error rejecting user:', error);
      
      // Detailed error handling
      let errorMessage = 'Error rejecting user';
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to reject users';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'not-found') {
        errorMessage = 'User not found. The user may have been deleted.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setActionError({ userId, error: errorMessage, action: 'reject' });
      setToastMessage(errorMessage);
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: UserStatus) => {
    const badges = {
      pending: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      ),
      approved: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      ),
      rejected: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      ),
    };
    return badges[status];
  };

  // Check if user is admin
  if (userProfile?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Shield className="w-8 h-8 mr-3 text-primary-600" />
          User Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage user accounts and approvals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.total}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {stats.pending}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {stats.approved}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    User
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                          {user.avatarInitials}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 mr-1" />
                            User
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openConfirmModal(user.id, 'approve', user.name)}
                              disabled={actionLoading === user.id}
                              className={`flex items-center transition-colors ${
                                actionLoading === user.id
                                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                              }`}
                            >
                              {actionLoading === user.id ? (
                                <>
                                  <div className="w-4 h-4 mr-1 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => openConfirmModal(user.id, 'reject', user.name)}
                              disabled={actionLoading === user.id}
                              className={`flex items-center transition-colors ${
                                actionLoading === user.id
                                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                                  : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                              }`}
                            >
                              {actionLoading === user.id ? (
                                <>
                                  <div className="w-4 h-4 mr-1 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                  Rejecting...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </button>
                          </div>
                          {actionError?.userId === user.id && (
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="text-xs text-red-600 dark:text-red-400">
                                {actionError.error}
                              </div>
                              <button
                                onClick={() => handleRetry(user.id, actionError.action)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline self-start"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {user.status === 'approved' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openConfirmModal(user.id, 'reject', user.name)}
                            disabled={actionLoading === user.id}
                            className={`flex items-center transition-colors ${
                              actionLoading === user.id
                                ? 'text-gray-400 cursor-not-allowed opacity-50'
                                : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                            }`}
                          >
                            {actionLoading === user.id ? (
                              <>
                                <div className="w-4 h-4 mr-1 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </>
                            )}
                          </button>
                          {actionError?.userId === user.id && (
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="text-xs text-red-600 dark:text-red-400">
                                {actionError.error}
                              </div>
                              <button
                                onClick={() => handleRetry(user.id, actionError.action)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline self-start"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {user.status === 'rejected' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openConfirmModal(user.id, 'approve', user.name)}
                            disabled={actionLoading === user.id}
                            className={`flex items-center transition-colors ${
                              actionLoading === user.id
                                ? 'text-gray-400 cursor-not-allowed opacity-50'
                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                            }`}
                          >
                            {actionLoading === user.id ? (
                              <>
                                <div className="w-4 h-4 mr-1 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </button>
                          {actionError?.userId === user.id && (
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="text-xs text-red-600 dark:text-red-400">
                                {actionError.error}
                              </div>
                              <button
                                onClick={() => handleRetry(user.id, actionError.action)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline self-start"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{filteredAndSortedUsers.length}</span>{' '}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeConfirmModal}
        onConfirm={() => {
          if (modalState.userId && modalState.action === 'approve') {
            handleApprove(modalState.userId);
          } else if (modalState.userId && modalState.action === 'reject') {
            handleReject(modalState.userId, modalState.reason);
          }
        }}
        title={
          modalState.action === 'approve'
            ? 'Approve User'
            : modalState.action === 'reject'
            ? 'Reject User'
            : 'Confirm Action'
        }
        message={
          modalState.action === 'approve'
            ? `Are you sure you want to approve "${modalState.userName}"? This user will gain access to the application.`
            : modalState.action === 'reject'
            ? `Are you sure you want to reject "${modalState.userName}"? This action cannot be undone easily.`
            : 'Are you sure you want to proceed?'
        }
        confirmText={modalState.action === 'approve' ? 'Approve' : modalState.action === 'reject' ? 'Reject' : 'Confirm'}
        cancelText="Cancel"
        type={modalState.action === 'approve' ? 'approve' : modalState.action === 'reject' ? 'reject' : 'warning'}
        showReasonField={modalState.action === 'reject'}
        reasonLabel="Rejection Reason (Optional)"
        reasonPlaceholder="Enter reason for rejection..."
        onReasonChange={(reason) => setModalState(prev => ({ ...prev, reason }))}
        isLoading={actionLoading === modalState.userId}
      />
    </div>
  );
};

export default Admin;
