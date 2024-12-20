import { signOut } from "firebase/auth";

export const LogOut = async (auth, navigate) => {

    try {
        await signOut(auth); navigate("/login"); // Redirige vers la page de connexion après déconnexion 
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }
}