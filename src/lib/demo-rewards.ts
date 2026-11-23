/** Katalog hadiah demo (penukaran poin di loket TPS). */
export type RewardCatalogItem = {
  id: string;
  name: string;
  points: number;
  detail?: string;
};

export const DEMO_REWARD_CATALOG: RewardCatalogItem[] = [
  { id: "soap", name: "Sabun", points: 50, detail: "Ambil di loket TPS" },
  { id: "groceries", name: "Paket sembako", points: 200, detail: "Ambil di loket TPS" },
  { id: "cooking-oil", name: "Minyak goreng 1 L", points: 350, detail: "Ambil di loket TPS" },
  { id: "phone-credit", name: "Pulsa Rp 10.000", points: 500, detail: "Diisi petugas TPS" },
  { id: "rice", name: "Beras 2 kg", points: 600, detail: "Ambil di loket TPS" },
  { id: "voucher", name: "Voucher belanja Rp 25.000", points: 800, detail: "Tukar di loket TPS" },
];
