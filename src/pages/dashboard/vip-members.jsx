import { useContext, useMemo, useState } from "react";
import { UserDataContext } from "@/context/UserDataContext";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { Common } from "@/constant/strings";
import CustomerTable from "@/widgets/table/customer_table";

export function VipMembers() {
  const { data, loading } = useContext(UserDataContext);
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.customerData);
  const [togglingVipIds, setTogglingVipIds] = useState([]);
  const vipMembers = useMemo(() => data.filter((user) => user.isVip).sort((a, b) => (a.name || "").localeCompare(b.name || "")), [data]);

  const handleToggleVip = async (user) => {
    if (togglingVipIds.includes(user.id)) return;
    setTogglingVipIds((ids) => [...ids, user.id]);
    const result = await updateFieldById(user.id, { isVip: !user.isVip });
    setTogglingVipIds((ids) => ids.filter((id) => id !== user.id));
    if (!result.success) alert(`Failed to update VIP status: ${result.error}`);
  };

  return <CustomerTable title="VIP Members" data={vipMembers} loading={loading} color="green" displayRow={vipMembers.length} onToggleVip={handleToggleVip} togglingVipIds={togglingVipIds} />;
}

export default VipMembers;
