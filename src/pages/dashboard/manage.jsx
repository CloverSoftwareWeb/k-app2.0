
import { useContext, useMemo, useState } from 'react';
import { UserDataContext } from '../../context/UserDataContext';
import CustomerTable from '../../widgets/table/customer_table';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { Common } from '@/constant/strings';

export function Manage() {
  const { data, loading } = useContext(UserDataContext);
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.customerData);
  const [togglingVipIds, setTogglingVipIds] = useState([]);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [data]
  );

  const handleToggleVip = async (user) => {
    if (togglingVipIds.includes(user.id)) return;
    setTogglingVipIds((ids) => [...ids, user.id]);
    const result = await updateFieldById(user.id, { isVip: !user.isVip });
    setTogglingVipIds((ids) => ids.filter((id) => id !== user.id));
    if (!result.success) alert(`Failed to update VIP status: ${result.error}`);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <CustomerTable title="Member's Table" data={sortedData} loading={loading} color="gray" displayRow={5} onToggleVip={handleToggleVip} togglingVipIds={togglingVipIds}/>
    </div>
  );
}

export default Manage;
