import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  CreditCardIcon,
  ClockIcon,
} from "lucide-react";

export function Verification() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  const fetchRequests = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/auth/admin/vendors/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/auth/admin/vendors/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (vendorId) => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/auth/admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== vendorId));
        fetchStats(); // Update stats after approval
      } else {
        alert("Failed to approve");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (vendorId) => {
    const token = sessionStorage.getItem('token');
    if (!window.confirm("Are you sure you want to decline and remove this vendor?")) return;

    try {
      const res = await fetch(`http://localhost:3000/auth/admin/vendors/${vendorId}/decline`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== vendorId));
        fetchStats(); // Update stats after rejection
      } else {
        alert("Failed to reject");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vendor Verification</h1>
          <p className="text-muted-foreground">
            Review vendor verification requests
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-gray-500 font-medium">Total Requests</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-3xl font-bold mb-1 text-amber-600">{stats.pending}</div>
            <div className="text-sm text-gray-500 font-medium">Pending Review</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-3xl font-bold mb-1 text-green-600">{stats.verified}</div>
            <div className="text-sm text-gray-500 font-medium">Approved</div>
          </div>
        </div>

        {/* Requests */}
        <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg border p-6"
            >
              {/* Vendor Info */}
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {request.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Email: {request.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <span className="flex items-center text-amber-600 text-sm">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                </div>
              </div>

              {/* Documents */}
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-3 border p-3 rounded">
                  <CreditCardIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">
                      Government ID
                    </div>
                    <div className="text-xs text-gray-500">
                      verification_document.pdf
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(request._id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Approve
                </button>

                <button
                  onClick={() => handleReject(request._id)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          ))}
          {!loading && requests.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed text-muted-foreground">
              No pending verification requests.
            </div>
          )}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}