
export const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
}

