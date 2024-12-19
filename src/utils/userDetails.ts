interface UserDetails {
  wallet: string;
  email: string;
  timestamp: string;
}

export function getUserDetails(wallet: string): UserDetails | null {
  try {
    const data = localStorage.getItem(`user_details_${wallet}`);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Failed to get user details:', err);
    return null;
  }
}

export function getAllUserDetails(): UserDetails[] {
  try {
    const details: UserDetails[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('user_details_')) {
        const data = localStorage.getItem(key);
        if (data) {
          details.push(JSON.parse(data));
        }
      }
    }
    return details;
  } catch (err) {
    console.error('Failed to get all user details:', err);
    return [];
  }
}
