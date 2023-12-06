import { AxiosError } from "axios";
import api from "../configs/axiosConfig";
import { Err, Ok } from "resultat";

type Relation = {
  _id: string;
  firstUserId: string;
  secondUserId: string;
  kind: "friend" | "block";
  since: number;
};

type Relationships = {
  friends: Relation[];
  blocked: Relation[];
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
