import type { IconType } from "react-icons";
import {
  MdOutlineAdd,
  MdOutlineApps,
  MdOutlineConfirmationNumber,
  MdOutlineDashboard,
  MdOutlineEmojiEvents,
  MdOutlineFactCheck,
  MdOutlineHelpOutline,
  MdOutlineHistory,
  MdOutlineInventory2,
  MdOutlineLocalShipping,
  MdOutlinePayments,
  MdOutlinePeople,
  MdOutlinePersonAdd,
  MdOutlinePlace,
  MdOutlineQrCode2,
} from "react-icons/md";

const SIZE = 22;

function navIcon(Icon: IconType) {
  return function NavIcon() {
    return <Icon size={SIZE} aria-hidden />;
  };
}

export const IconQr = navIcon(MdOutlineQrCode2);
export const IconApps = navIcon(MdOutlineApps);
export const IconMenu = IconApps;

/** Setoran / riwayat */
export const IconHistory = navIcon(MdOutlineHistory);
/** Tab setoran staff — daftar kantong */
export const IconBox = navIcon(MdOutlineInventory2);
export const IconInventory = IconBox;

export const IconTrophy = navIcon(MdOutlineEmojiEvents);
export const IconStar = IconTrophy;

/** Penukaran poin — tiket */
export const IconRedeem = navIcon(MdOutlineConfirmationNumber);
export const IconTicket = IconRedeem;
export const IconGift = IconRedeem;

export const IconPin = navIcon(MdOutlinePlace);

export const IconDashboard = navIcon(MdOutlineDashboard);
/** Validasi berat */
export const IconScale = navIcon(MdOutlineFactCheck);
/** Kirim bulk ke TPA */
export const IconTruck = navIcon(MdOutlineLocalShipping);

export const IconPay = navIcon(MdOutlinePayments);
export const IconPeople = navIcon(MdOutlinePeople);
export const IconAdd = navIcon(MdOutlinePersonAdd);
export const IconHelp = navIcon(MdOutlineHelpOutline);

/** Generic add (circle) — fallback */
export const IconAddCircle = navIcon(MdOutlineAdd);