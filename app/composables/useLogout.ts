export function useLogout() {
  const auth = useAuthStore();
  return async () => {
    auth.logout();
    navigateTo({ name: "index" });
  };
}
