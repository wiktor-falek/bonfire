import { AxiosError } from "axios";
import api from "../configs/axiosConfig";
import { Err, Ok } from "resultat";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  imgSrc: string;
}

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
