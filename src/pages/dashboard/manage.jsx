
import { useContext } from 'react';
import { UserDataContext } from '../../context/UserDataContext';
import CustomerTable from '../../widgets/table/customer_table';

export function Manage() {
  const { data, loading } = useContext(UserDataContext);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <CustomerTable title={'Customer Table'} data={data} loading={loading} color={'gray'} displayRow={5}/>
    </div>
  );
}

export default Manage;
