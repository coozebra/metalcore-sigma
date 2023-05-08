import { useState, useEffect } from 'react';

import { ISelected } from 'dashboard/components/NFTs/filters/types';
import { IAsset } from 'dashboard/types/NFT';

export interface IUseFilters {
  selected: ISelected;
  handleSelected: (arg0?: any) => void;
  handleRemove: (arg0?: any) => void;
  clear: (arg0?: any) => void;
  data?: IAsset[];
}

export const useFilters = ({ NFTs }: { NFTs: IAsset[] }): IUseFilters => {
  const [selected, setSelected] = useState<ISelected>(new Map());
  const [data, setData] = useState<IAsset[]>();
  const isFiltering = selected.size;

  const handleDropdown = ({ trait, value }) => {
    const updatedFilters = new Map(selected);

    updatedFilters.set(trait, new Set(value));

    setSelected(updatedFilters);
  };

  const handleCheckbox = ({ trait, value }) => {
    const traitFilters = new Set(selected.get(trait));
    const isSelected = traitFilters.has(value);

    isSelected ? traitFilters.delete(value) : traitFilters.add(value);

    const hasFilters = traitFilters.size;
    const updatedFilters = new Map(selected);

    !hasFilters ? updatedFilters.delete(trait) : updatedFilters.set(trait, traitFilters);

    setSelected(updatedFilters);
  };

  const handleSelected = ({ trait, value, type }) => {
    switch (type) {
      case 'dropdown':
        return handleDropdown({ trait, value });
      case 'checkboxes':
      default:
        handleCheckbox({ trait, value });
    }
  };

  const handleFilters = () => {
    const filteredData = NFTs.filter(NFT =>
      Array.from(selected.entries()).every(([trait, values]) => values.has(NFT.attributes[trait])),
    );

    setData(filteredData);
  };

  const handleRemove = ({ trait, value }) => {
    const traitFilters = new Set(selected.get(trait));
    const updatedFilters = new Map(selected);

    traitFilters.delete(value);
    const hasFilters = traitFilters.size;

    !hasFilters ? updatedFilters.delete(trait) : updatedFilters.set(trait, traitFilters);

    setSelected(updatedFilters);
  };

  const clear = () => setSelected(new Map());

  useEffect(() => {
    if (isFiltering) {
      handleFilters();
    }
  }, [selected]);

  return { selected, handleSelected, handleRemove, clear, data: isFiltering ? data : NFTs };
};
