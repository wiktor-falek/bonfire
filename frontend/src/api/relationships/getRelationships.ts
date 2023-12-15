import { AxiosError } from "axios";
import api from "../configs/axiosConfig";
import { Err, Ok } from "resultat";
import type { UserProfile } from "../users/getCurrentProfile";

export type Relationships = {
  friends: UserProfile[];
  pending: UserProfile[];
  blocked: UserProfile[];
};

async function getRelationships() {
  try {
    const response = await api.get<Relationships>("/api/relationships");

    return Ok(response.data);
  } catch (e) {
    const error = e as AxiosError;
    const data = error.response?.data as { error: string };
    return Err(data);
  }
}

export default getRelationships;
