interface SkillsMatrixProps {
  data: {
    rows: Array<{
      title: string;
      count?: string;
      values: number[];
    }>;
    columns: string[];
  };
}

export function SkillsMatrix({ data }: SkillsMatrixProps) {
  // Function to determine background color based on percentage value
  const getBackgroundColor = (value: number) => {
    if (value >= 90) return '#F8696B'; // Dark red
    if (value >= 80) return '#F8896B'; // Red
    if (value >= 75) return '#FECA7E'; // Orange
    if (value >= 65) return '#FFEB84'; // Yellow
    if (value >= 55) return '#D4DE81'; // Light yellow-green
    if (value >= 45) return '#A8DB8E'; // Light green
    if (value >= 30) return '#63BE7B'; // Green
    return '#63BE7B'; // Default green
  };

  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='p-2 text-left font-semibold text-gray-700 border-r border-gray-700'>Skills</th>
            {data.columns.map((column, index) => (
              <th
                key={index}
                className='p-2 text-left font-semibold text-gray-700 whitespace-normal border-r border-gray-700 overflow-hidden hover:overflow-visible'
                style={{ maxWidth: '75px' }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='border-b border-gray-700 text-sm'>
              <td className='p-2 font-medium text-gray-700 border-r border-gray-700'>
                {row.title}
                {row.count && <div className='text-xs text-gray-500'>{row.count}</div>}
              </td>
              {row.values.map((value, colIndex) => (
                <td
                  key={colIndex}
                  className='p-2 text-center font-medium border-r border-gray-700'
                  style={{ backgroundColor: getBackgroundColor(value) }}>
                  {value}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
