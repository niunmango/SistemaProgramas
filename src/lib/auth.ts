import { pb } from './pb';
import type { User } from './pb';

export function getLoggedInUser(): User | null {
  if (pb.authStore.isValid && pb.authStore.model) {
    return {
      id: pb.authStore.model.id,
      email: pb.authStore.model.email || '',
      username: pb.authStore.model.username || '',
      name: pb.authStore.model.name || '',
      role: pb.authStore.model.role,
      carrera: pb.authStore.model.carrera,
      escuela: pb.authStore.model.escuela,
    };
  }
  return null;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const authData = await pb.collection('users').authWithPassword(email, password);
  const user = getLoggedInUser();
  if (!user) {
    throw new Error('Authentication failed or invalid role');
  }
  return user;
}

export function logout() {
  pb.authStore.clear();
}
