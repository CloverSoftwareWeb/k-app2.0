
import { useContext, useEffect } from 'react'
import { UserDataContext } from '../../context/UserDataContext'
import { useDate } from '../../hooks/useDate'
import AgeTable from '../../widgets/table/age_table'
import DateTable from '../../widgets/table/date_table'
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery'
import { Common } from '@/constant/strings'

export function Tables() {
  const { data, loading } = useContext(UserDataContext);
  const { getNextMonthData, getPastExpiredData, getPeopleOver60 } = useDate();
  const upcomingRenewalData = getNextMonthData(data)
  const lapseData = getPastExpiredData(data)
  const seniorCitizen = getPeopleOver60(data)
  const { updateFieldById } = useFirestoreQuery(Common.collectionName.statistics);

  useEffect(() => {
    if (lapseData.length > 0) {
      updateFieldById(Common.documentIds.statistics, { lapseCount: lapseData.length });
    }
  }, [lapseData])

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <DateTable title={'Upcoming Renewal Card Table '} data={upcomingRenewalData} loading={loading} color={'orange'} displayRow={3} />
      <DateTable title={'Lapse Table '} data={lapseData} loading={loading} color={'red'} displayRow={3}/>
      <AgeTable title={'Senior Citizen Table '} data={seniorCitizen} loading={loading} color={'blue'} displayRow={3}/>
    </div>
  );
}

export default Tables;
