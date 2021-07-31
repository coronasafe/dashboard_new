interface ShowBedInfoProps {
  bedData: any;
  category: string;
  total: any;
}

export const ShowBedInfo: React.FC<ShowBedInfoProps> = ({
  bedData,
  category,
  total,
}) => (
  <div className="grid row-span-2 grid-cols-9 mt-2 h-12">
    <div className="col-span-1 pl-3 pt-3 dark:text-gray-200 text-sm font-medium">
      {category}
    </div>
    {bedData.map((bed: any, idx: number) => {
      if (!total[idx].total) {
        return (
          <div key={idx} className="grid col-span-2 grid-cols-2 ml-4 mr-4" />
        );
      }
      return (
        <div key={idx} className="grid col-span-2 grid-cols-2 ml-4 mr-4">
          <div className="grid grid-rows-3">
            <div className="row-span-1 text-center text-red-500 text-sm font-semibold">
              Used
            </div>
            <div className="row-span-2 text-center dark:text-gray-200 text-gray-800 text-lg font-semibold">
              {bed.used}/{bed.total}
            </div>
          </div>
          <div className="grid grid-rows-3">
            <div className="row-span-1 text-center text-primary-500 text-sm font-semibold">
              Vacant
            </div>
            <div className="row-span-2 text-center dark:text-gray-200 text-gray-800 text-lg font-semibold">
              {bed.vacant}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
