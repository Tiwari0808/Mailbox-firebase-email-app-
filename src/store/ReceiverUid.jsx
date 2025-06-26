import { get, ref } from "firebase/database"
import { db } from "../firebase"


export const getRecieverUid = async (email) => {
    const users = (await get(ref(db, 'users'))).val();
    if (!users) return;

    for (const uid in users) {
        if (users[uid].email === email) {
            return uid;
        }
    }

    return null;

}
