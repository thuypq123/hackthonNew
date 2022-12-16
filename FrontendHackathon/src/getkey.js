import axios from "axios";
let config = {
    "headers": {
      "accept": "application/json",
        "Content-Type": "application/json",
    }
  }
export const Getkey = async () => {
    const respone = await axios.get("http://localhost:3000/get_key", config);
    return await respone.data.data.key;
}