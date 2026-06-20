
import { useContext, useMemo } from 'react';
import { UserDataContext } from '../../context/UserDataContext';
import CustomerTable from '../../widgets/table/customer_table';

export function Manage() {
  const { data, loading } = useContext(UserDataContext);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [data]
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <CustomerTable title={"Member's Table"} data={sortedData} loading={loading} color={'gray'} displayRow={5}/>
    </div>
  );
}

export default Manage;
