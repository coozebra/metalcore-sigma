export interface INFTAttribute {
  trait_type?: string;
  value?: string | number;
}

export interface INFT {
  attributes?: INFTAttribute[];
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
  token_id?: number;
}
