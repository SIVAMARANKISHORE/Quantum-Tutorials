import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const EmployeeContext = createContext();

const API_ENDPOINT = "https://6a4b368cf5eab0bb6b625744.mockapi.io/Employee";

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [systemRecordId, setSystemRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState(null);

  const isFirstMount = useRef(true);
  const syncInterval = 10000; // 10s default

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Fetch employees from API and sync system records
  const fetchEmployees = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setIsSyncing(true);
    
    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Find system announcements record
          const systemRecord = data.find(emp => emp.role === 'system' && emp.name === 'SYSTEM_ANNOUNCEMENTS');
          
          if (systemRecord) {
            setSystemRecordId(systemRecord.id);
            setAnnouncements(systemRecord.announcements || []);
          } else {
            // Create system record if it does not exist
            const createResponse = await fetch(API_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "SYSTEM_ANNOUNCEMENTS",
                role: "system",
                announcements: []
              })
            });
            if (createResponse.ok) {
              const record = await createResponse.json();
              setSystemRecordId(record.id);
              setAnnouncements([]);
            }
          }

          // Filter out system record from standard employee listings
          const normalized = data
            .filter(emp => emp.role !== 'system' && emp.name !== 'SYSTEM_ANNOUNCEMENTS')
            .map(emp => {
              const initials = emp.avatar && emp.avatar.length <= 2 
                ? emp.avatar 
                : (emp.name || "Unknown").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return {
                ...emp,
                id: emp.id,
                employeeId: emp.employeeId || `EMP${String(emp.id).padStart(3, '0')}`,
                password: emp.password || "password123",
                name: emp.name || "Unknown Name",
                email: emp.email || "No Email",
                department: emp.department || "Unassigned",
                jobTitle: emp.jobTitle || (emp.role && emp.role !== 'admin' ? emp.role : "Employee"),
                role: emp.role === 'admin' ? 'admin' : 'employee', // strictly admin or employee
                status: emp.status || "Active",
                location: emp.location || "Unknown Location",
                joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
                phone: emp.phone || "-",
                salary: parseInt(emp.salary) || 0,
                avatar: initials || "EE",
                attendance: emp.attendance || [],
                leaves: emp.leaves || [],
                gender: emp.gender || "Male"
              };
            });
          setEmployees(normalized);
        } else {
          console.error("Invalid API response format (expected array)");
        }
      }
    } catch (error) {
      console.error(`Connection failed: ${error.message}`);
    } finally {
      if (showLoading) setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // CRUD: Add Employee
  const addEmployee = useCallback(async (employee) => {
    const initials = employee.name
      .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const payload = { 
      ...employee, 
      avatar: initials,
      attendance: [],
      leaves: []
    };
    
    setIsSyncing(true);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const newEmp = await response.json();
        const normalizedEmp = {
          ...newEmp,
          salary: parseInt(newEmp.salary) || 0,
          avatar: newEmp.avatar || initials,
          attendance: [],
          leaves: []
        };
        setEmployees(prev => [...prev, normalizedEmp]);
        showNotification("Employee added successfully!");
        return { success: true, employee: normalizedEmp };
      }
    } catch (error) {
      showNotification(`Failed to add employee: ${error.message}`, "error");
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  }, [showNotification]);

  // CRUD: Update Employee (perserving attendance and leaves)
  const updateEmployee = useCallback(async (id, updated) => {
    const existing = employees.find(emp => String(emp.id) === String(id));
    const initials = updated.name
      .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const payload = { 
      ...existing,
      ...updated, 
      avatar: initials,
      attendance: existing ? existing.attendance : [],
      leaves: existing ? existing.leaves : []
    };
    
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const updatedEmp = await response.json();
        const normalizedEmp = {
          ...updatedEmp,
          salary: parseInt(updatedEmp.salary) || 0,
          avatar: updatedEmp.avatar || initials,
          attendance: updatedEmp.attendance || [],
          leaves: updatedEmp.leaves || []
        };
        setEmployees(prev =>
          prev.map(emp => String(emp.id) === String(id) ? normalizedEmp : emp)
        );
        showNotification("Employee updated successfully!");
        return { success: true, employee: normalizedEmp };
      }
    } catch (error) {
      showNotification(`Failed to update employee: ${error.message}`, "error");
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  }, [employees, showNotification]);

  // CRUD: Delete Employee
  const deleteEmployee = useCallback(async (id) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setEmployees(prev => prev.filter(emp => String(emp.id) !== String(id)));
        showNotification("Employee removed.", "error");
        return { success: true };
      }
    } catch (error) {
      showNotification(`Failed to delete employee: ${error.message}`, "error");
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  }, [showNotification]);

  // Helper: Get Employee
  const getEmployee = useCallback(
    (id) => employees.find((e) => String(e.id) === String(id)),
    [employees]
  );

  // Sync state helpers
  const saveEmployeeDataOnApi = async (id, payload) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const updatedEmp = await response.json();
        setEmployees(prev =>
          prev.map(emp => String(emp.id) === String(id) ? { ...emp, ...updatedEmp } : emp)
        );
        return true;
      }
    } catch (error) {
      console.error("Failed to save employee data on API:", error);
    }
    return false;
  };

  // Clock In Helper
  const clockInEmployee = useCallback(async (id) => {
    const emp = employees.find(e => String(e.id) === String(id));
    if (!emp) return false;

    const todayStr = new Date().toISOString().split("T")[0];
    const newRecord = {
      id: Date.now().toString(),
      date: todayStr,
      clockIn: new Date().toISOString(),
      clockOut: null,
      status: "Present"
    };

    const updatedAttendance = [newRecord, ...(emp.attendance || [])];
    const success = await saveEmployeeDataOnApi(id, { ...emp, attendance: updatedAttendance });
    if (success) {
      showNotification("Clocked in successfully!");
    }
    return success;
  }, [employees, showNotification]);

  // Clock Out Helper
  const clockOutEmployee = useCallback(async (id) => {
    const emp = employees.find(e => String(e.id) === String(id));
    if (!emp) return false;

    const todayStr = new Date().toISOString().split("T")[0];
    const updatedAttendance = (emp.attendance || []).map(record => {
      if (record.date === todayStr && !record.clockOut) {
        return { ...record, clockOut: new Date().toISOString() };
      }
      return record;
    });

    const success = await saveEmployeeDataOnApi(id, { ...emp, attendance: updatedAttendance });
    if (success) {
      showNotification("Clocked out successfully!");
    }
    return success;
  }, [employees, showNotification]);

  // Submit Leave Request Helper
  const submitLeaveRequest = useCallback(async (id, leaveDetails) => {
    const emp = employees.find(e => String(e.id) === String(id));
    if (!emp) return false;

    const newLeave = {
      id: Date.now().toString(),
      type: leaveDetails.type,
      startDate: leaveDetails.startDate,
      endDate: leaveDetails.endDate,
      reason: leaveDetails.reason,
      status: "Pending",
      requestDate: new Date().toISOString().split("T")[0]
    };

    const updatedLeaves = [newLeave, ...(emp.leaves || [])];
    const success = await saveEmployeeDataOnApi(id, { ...emp, leaves: updatedLeaves });
    if (success) {
      showNotification("Leave request submitted successfully!");
    }
    return success;
  }, [employees, showNotification]);

  // Process Leave Request Helper (Approve/Reject)
  const processLeaveRequest = useCallback(async (employeeDbId, leaveId, status) => {
    const emp = employees.find(e => String(e.id) === String(employeeDbId));
    if (!emp) return false;

    const updatedLeaves = (emp.leaves || []).map(lv => {
      if (lv.id === leaveId) {
        return { ...lv, status };
      }
      return lv;
    });

    // Check if employee is currently active on leave
    let updatedStatus = emp.status;
    if (status === "Approved") {
      const today = new Date().toISOString().split("T")[0];
      const targetLeave = emp.leaves.find(l => l.id === leaveId);
      if (targetLeave && today >= targetLeave.startDate && today <= targetLeave.endDate) {
        updatedStatus = "On Leave";
      }
    }

    const success = await saveEmployeeDataOnApi(employeeDbId, { ...emp, leaves: updatedLeaves, status: updatedStatus });
    if (success) {
      showNotification(`Leave request ${status.toLowerCase()}!`);
    }
    return success;
  }, [employees, showNotification]);

  // Global Announcements Sync
  const saveAnnouncements = async (updatedAnnouncements) => {
    if (!systemRecordId) return false;
    try {
      const response = await fetch(`${API_ENDPOINT}/${systemRecordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "SYSTEM_ANNOUNCEMENTS",
          role: "system",
          announcements: updatedAnnouncements
        })
      });
      if (response.ok) {
        setAnnouncements(updatedAnnouncements);
        return true;
      }
    } catch (e) {
      console.error("Failed to save announcements:", e);
    }
    return false;
  };

  const addAnnouncement = useCallback(async (ann) => {
    const newAnn = {
      id: Date.now().toString(),
      title: ann.title,
      content: ann.content,
      publishedDate: new Date().toISOString(),
      priority: ann.priority || "Normal", // High, Normal, Low
      pinned: ann.pinned || false,
      departments: ann.departments || ["All"] // Target departments
    };
    const updated = [newAnn, ...announcements];
    const success = await saveAnnouncements(updated);
    if (success) {
      showNotification("Announcement published!");
    }
    return success;
  }, [announcements, systemRecordId, showNotification]);

  const updateAnnouncement = useCallback(async (id, updatedFields) => {
    const updated = announcements.map(ann => 
      String(ann.id) === String(id) ? { ...ann, ...updatedFields } : ann
    );
    const success = await saveAnnouncements(updated);
    if (success) {
      showNotification("Announcement updated!");
    }
    return success;
  }, [announcements, systemRecordId, showNotification]);

  const deleteAnnouncement = useCallback(async (id) => {
    const updated = announcements.filter(ann => String(ann.id) !== String(id));
    const success = await saveAnnouncements(updated);
    if (success) {
      showNotification("Announcement deleted.");
    }
    return success;
  }, [announcements, systemRecordId, showNotification]);

  // Polling Effect
  useEffect(() => {
    fetchEmployees(isFirstMount.current);
    isFirstMount.current = false;
    
    const intervalId = setInterval(() => {
      fetchEmployees(false);
    }, syncInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchEmployees]);

  // Focus Refresh Effect
  useEffect(() => {
    const handleFocus = () => {
      fetchEmployees(false);
    };
    
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchEmployees]);

  // Aggregate global leaves and attendance for Admin view
  const allAttendance = employees.flatMap(emp => 
    (emp.attendance || []).map(att => ({
      ...att,
      employeeDbId: emp.id,
      employeeId: emp.employeeId,
      name: emp.name,
      department: emp.department
    }))
  );

  const allLeaves = employees.flatMap(emp => 
    (emp.leaves || []).map(lv => ({
      ...lv,
      employeeDbId: emp.id,
      employeeId: emp.employeeId,
      name: emp.name,
      department: emp.department
    }))
  );

  // Stats Calculations
  const stats = {
    total:      employees.length,
    active:     employees.filter((e) => e.status === "Active").length,
    inactive:   employees.filter((e) => e.status === "Inactive").length,
    onLeave:    employees.filter((e) => e.status === "On Leave").length,
    departments:[...new Set(employees.map((e) => e.department))].length,
    avgSalary:  employees.length > 0 
      ? Math.round(employees.reduce((acc, e) => acc + (e.salary || 0), 0) / employees.length)
      : 0,
    pendingLeaves: allLeaves.filter(lv => lv.status === "Pending").length
  };

  const departmentData = [...new Set(employees.map((e) => e.department))].map(
    (dept) => {
      const group = employees.filter((e) => e.department === dept);
      return {
        name:      dept,
        count:     group.length,
        active:    group.filter((e) => e.status === "Active").length,
        avgSalary: group.length > 0 
          ? Math.round(group.reduce((acc, e) => acc + (e.salary || 0), 0) / group.length) 
          : 0,
      };
    }
  );

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        announcements,
        allAttendance,
        allLeaves,
        isLoading,
        isSyncing,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        stats,
        departmentData,
        notification,
        clockInEmployee,
        clockOutEmployee,
        submitLeaveRequest,
        processLeaveRequest,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeeContext);
}
