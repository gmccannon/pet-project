import React from 'react';

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const SelectDropdown = (props: Props) => {
  return (
    <div className="mb-4">
      {props.label && <label className="block mb-1 font-medium text-gray-700">{props.label}</label>}
      <select
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- Select an option --</option>
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;
