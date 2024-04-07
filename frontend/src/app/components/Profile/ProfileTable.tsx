import React from 'react'
import User from '@/app/redux/Resources/userSlice';

export interface ProfileTableProps {
  tabledata: ProfileTableItems[];
}

export interface ProfileTableItems {
  title: string;
  value: string;
}


const ProfileTable : React.FC<ProfileTableProps> = ({tabledata}) => {
  return (
    <div className="w-full border-2 overflow-hidden border-indigo-950 rounded-lg">
      <table className="w-full shadow divide-y divide-gray-400">
        <tbody className="divide-y divide-gray-400">

        {tabledata.map((data, key) => (
          <tr key={key}>
            <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-800">{data.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{data.value}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProfileTable