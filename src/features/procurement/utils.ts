export const getNormalizedStatus = (status: string): "ONGOING" | "ON_SHIPMENT" | "DONE" | "OTHER" => {
  if (status === "ONGOING" || status === "PURCHASING" || status === "APPROVED") {
    return "ONGOING";
  }
  if (status === "ON_SHIPMENT") {
    return "ON_SHIPMENT";
  }
  if (status === "DONE" || status === "DELIVERED") {
    return "DONE";
  }
  return "OTHER";
};

export const getStatusLabel = (status: string) => {
  const normalized = getNormalizedStatus(status);
  switch (normalized) {
    case "ONGOING":
      return { label: "Ongoing", className: "bg-red-500/10 text-red-500 border-red-500/20" };
    case "ON_SHIPMENT":
      return { label: "On Shipment", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" };
    case "DONE":
      return { label: "Done", className: "bg-green-500/10 text-green-500 border-green-500/20" };
    default:
      return { label: "Rejected", className: "bg-zinc-800/30 text-gray-500 border-zinc-800" };
  }
};
