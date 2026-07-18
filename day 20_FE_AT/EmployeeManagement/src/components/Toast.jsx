import { useEmployees } from "../context/EmployeeContext";

export default function Toast() {
  const { notification } = useEmployees();
  if (!notification) return null;

  const isSuccess = notification.type === "success";
  return (
    <div className={`toast toast-${notification.type}`}>
      <span>{isSuccess ? "✅" : "🗑️"}</span>
      <span>{notification.message}</span>
    </div>
  );
}
