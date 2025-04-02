import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/auth/AuthProvider";

export function useEmployeeId(): { employeeId?: string; loading: boolean } {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherId = async () => {
      if (!user) return;

      const userDocRef = doc(db, "companies", "companyId02", "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setEmployeeId(userSnap.data().id);
      } else {
        console.warn("No user doc found for UID:", user.uid);
      }

      setLoading(false);
    };

    fetchTeacherId();
  }, [user]);

  return { employeeId, loading };
}
