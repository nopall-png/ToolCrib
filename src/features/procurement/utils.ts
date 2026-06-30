export const getNormalizedStatus = (status: string): "ONGOING" | "ON_SHIPMENT" | "DONE" | "REJECTED" => {
  if (status === "ONGOING" || status === "PURCHASING" || status === "APPROVED") {
    return "ONGOING";
  }
  if (status === "ON_SHIPMENT") {
    return "ON_SHIPMENT";
  }
  if (status === "DONE" || status === "DELIVERED") {
    return "DONE";
  }
  return "REJECTED";
};

export const getStatusLabel = (status: string) => {
  const normalized = getNormalizedStatus(status);
  switch (normalized) {
    case "ONGOING":
      return { label: "ON GOING", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    case "ON_SHIPMENT":
      return { label: "ON SHIPMENT", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" };
    case "DONE":
      return { label: "DONE", className: "bg-green-500/10 text-green-500 border-green-500/20" };
    case "REJECTED":
    default:
      return { label: "REJECTED", className: "bg-red-500/10 text-red-500 border-red-500/20" };
  }
};
