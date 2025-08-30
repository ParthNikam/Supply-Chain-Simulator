import { pb } from "@/lib/pocketbase";


const getMap = async () => {
    try {
    // Get the current session to access the access token
    const { isValid, token, record } = pb.authStore;
    if (!isValid || !token) {
      console.error("No valid session or access token");
      return;
    }

    console.log(isValid, record);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/map`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Data fetched:", result);
    return result.data;
  } catch (error) {
    console.log("Error message", error);
  }
}

export {getMap};