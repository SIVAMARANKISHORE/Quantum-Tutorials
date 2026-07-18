import { getAvatarColor } from "../data/employeeData";

export default function Avatar({ employee, size = "sm" }) {
  const color = getAvatarColor(employee.id);
  return (
    <div
      className={`avatar${size === "lg" ? " avatar-lg" : ""}`}
      style={{ background: color }}
      title={employee.name}
    >
      {employee.avatar}
    </div>
  );
}
