/** Auth demo — seluruhnya di browser (tanpa API). */

const TOKEN_CUSTOMER = "demo.plastup.customer";
const TOKEN_STAFF = "demo.plastup.staff";

function pause(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginCustomerDemo(phone: string, password: string): Promise<string> {
  await pause();
  if (!phone.trim() || !password) {
    throw new Error("Nomor HP dan kata sandi wajib diisi.");
  }
  return TOKEN_CUSTOMER;
}

export async function registerCustomerDemo(input: {
  firstName: string;
  phone: string;
  password: string;
}): Promise<string> {
  await pause();
  if (!input.firstName.trim() || !input.phone.trim() || !input.password) {
    throw new Error("Lengkapi data wajib untuk daftar.");
  }
  return TOKEN_CUSTOMER;
}

export async function loginStaffDemo(username: string, password: string): Promise<string> {
  await pause();
  if (!username.trim() || !password) {
    throw new Error("Username dan kata sandi wajib diisi.");
  }
  return TOKEN_STAFF;
}

export async function upsertCustomerDemo(phone: string): Promise<{ created: boolean }> {
  await pause();
  if (!phone.trim()) {
    throw new Error("Nomor HP wajib diisi.");
  }
  return { created: true };
}