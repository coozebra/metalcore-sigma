export interface IZIndex {
  readonly [key: string]: number;
}

const scale: IZIndex = {
  zIndex1: 100,
  zIndex2: 200,
  zIndex3: 300,
  zIndex4: 400,
  zIndex5: 500,
  zIndex6: 600,
  zIndex7: 700,
  zIndex8: 800,
  zIndex9: 900,
  zIndex10: 1000,
};

export const zIndex: IZIndex = {
  header: scale.zIndex5,
  backdrop: scale.zIndex6,
  modal: scale.zIndex7,
};
