import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";

const TempTableRow = () => (
  <div>
    <a href="#">FHC KODANAD KOOVAPPADY CMC HOMECARE</a>

    <p className="text-gray-400 mb-2">Covid Management Center</p>

    <p>+919020411789</p>
  </div>
);

export const columns: ColumnType<DefaultRecordType>[] = [
  {
    title: "NAME",
    key: "name",
    dataIndex: "name",
    width: "16rem",
    align: "left",
  },
  {
    title: "LAST UPDATED",
    key: "lastUpdated",
    dataIndex: "lastUpdated",
    width: "8rem",
    align: "right",
  },
  {
    title: "RESULT AWAITED",
    key: "resultAwaited",
    dataIndex: "resultAwaited",
    width: "8rem",
    align: "right",
  },
  {
    title: "TESTS DISCARDED",
    key: "testsDiscarded",
    dataIndex: "testsDiscarded",
    width: "8rem",
    align: "right",
  },
  {
    title: "TOTAL PATIENTS",
    key: "totalPatients",
    dataIndex: "totalPatients",
    width: "8rem",
    align: "right",
  },
  {
    title: "NEGATIVE RESULTS",
    key: "negativeResults",
    dataIndex: "negativeResults",
    width: "8rem",
    align: "right",
  },
  {
    title: "POSITIVE RESULTS",
    key: "positiveResults",
    dataIndex: "positiveResults",
    width: "8rem",
    align: "right",
  },
];

export const data = Array.from({ length: 100 }).map((_) => ({
  name: <TempTableRow />,
  lastUpdated: "a day ago",
  resultAwaited: 0,
  testsDiscarded: 0,
  totalPatients: 3432,
  negativeResults: 177,
  positiveResults: 0,
}));
