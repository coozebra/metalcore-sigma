import { NFT_STATUS } from 'dashboard/types/NFT';
import { IFilterOptions } from 'dashboard/components/NFTs/filters/types';

export const filters: IFilterOptions[] = [
  {
    trait: 'status',
    type: 'dropdown',
    values: [
      { label: 'All NFTS', value: [NFT_STATUS.locked, NFT_STATUS.unlocked] },
      { label: 'In Game', value: [NFT_STATUS.locked] },
      { label: 'In Wallet', value: [NFT_STATUS.unlocked] },
    ],
  },
  { trait: 'Rarity', values: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] },
  { trait: 'Faction', values: ['Earther', 'Gearbreaker', 'Metal Punk', 'Holy Corp'] },
  {
    trait: 'Combat Role',
    values: [
      'Light Infantry',
      'Heavy Infantry',
      'Super Heavy Infantry',
      'Medic',
      'Scout',
      'Engineer',
      'Sniper',
      'Pilot',
    ],
  },
  {
    trait: 'Sub Class Name',
    values: [
      'Soldier',
      'Marksman',
      'SAW',
      'Tactical',
      'Sergeant',
      'Heavy Gunner',
      'Heavy Assault',
      'Close assault',
      'Anti Vehicle',
      'Specialist',
      'Field medic',
      'Squad medic',
      'Sawbones',
      'Cyber Surgeon',
      'Biomancer',
      'Recon',
      'Spotter',
      'Infiltrator',
      'Disruptor',
      'Forward Operator',
      'Mechanic',
      'Armorer',
      'Energy Tech',
      'War Tech',
      'Nanomancer',
      'Ranger',
      'Ambusher',
      'Armor Hunter',
      'Forward observer',
      'Pilot Grade 5',
      'Pilot Grade 4',
      'Pilot Grade 3',
      'Pilot Grade 2',
      'Pilot Grade 1',
      'Super Heavy Assault',
      'Dreadnought',
    ],
  },
];
